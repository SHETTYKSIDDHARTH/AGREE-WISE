from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import requests
import os
import tempfile
from dotenv import load_dotenv
from document_processor import process_document
from ai_analyzer import analyze_contract, get_analysis_summary
from tts_generator import generate_audio, cleanup_audio_file

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend requests (Vercel + localhost)
CORS(app, origins=[
    'https://agree-w1se.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
])

LINGO_DEV_API_KEY = os.getenv('LINGO_DEV_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# File upload configuration
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'heic'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Analyze uploaded document(s) - supports single or multiple files
    Extract text using OCR or text extraction

    Expected multipart/form-data:
    - files[]: One or more document files (for multi-page contracts)
    - document_language: Language code for OCR (default: 'en')
    - explanation_language: Language for AI analysis output (default: 'en')
    - extract_only: If true, only extract text without AI analysis (default: true for now)
    """
    try:
        # Get language parameters
        document_language = request.form.get('document_language', request.form.get('language', 'en'))  # Fallback to 'language' for backward compatibility
        explanation_language = request.form.get('explanation_language', 'en')
        extract_only = request.form.get('extract_only', 'true').lower() == 'true'

        # Check for multiple files (new format)
        files = request.files.getlist('files[]')

        # Fallback to single file (backwards compatibility)
        if not files:
            single_file = request.files.get('file')
            if single_file:
                files = [single_file]

        if not files or len(files) == 0:
            return jsonify({'error': 'No files provided'}), 400

        # Validate all files
        for file in files:
            if file.filename == '':
                return jsonify({'error': 'One or more files have no name'}), 400
            if not allowed_file(file.filename):
                return jsonify({
                    'error': f'File type not allowed: {file.filename}. Supported: {", ".join(ALLOWED_EXTENSIONS)}'
                }), 400

        print(f'📄 Analyzing {len(files)} file(s)')
        print(f'📄 Document Language: {document_language}')
        print(f'💬 Explanation Language: {explanation_language}')

        # Process each file
        all_pages = []
        temp_paths = []

        try:
            for idx, file in enumerate(files, 1):
                filename = secure_filename(file.filename)

                # Save file temporarily
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1])
                temp_path = temp_file.name
                temp_paths.append(temp_path)

                file.save(temp_path)
                print(f'💾 Page {idx}/{len(files)}: {filename}')

                # Process document
                result = process_document(temp_path, document_language)

                if not result['success']:
                    return jsonify({
                        'success': False,
                        'error': f'Failed to process page {idx} ({filename}): {result["error"]}'
                    }), 500

                # Store page result
                all_pages.append({
                    'page_number': idx,
                    'filename': filename,
                    'text': result['text'],
                    'file_type': result['file_type'],
                    'extraction_method': result['method'],
                    'char_count': result['char_count']
                })

                print(f'✓ Page {idx} complete: {result["char_count"]} characters')

            # Combine all text with page breaks
            combined_text = '\n\n--- PAGE BREAK ---\n\n'.join(
                page['text'] for page in all_pages
            )

            # Calculate total characters
            total_chars = sum(page['char_count'] for page in all_pages)

            # Build response
            response_data = {
                'success': True,
                'extracted_text': combined_text,
                'total_pages': len(all_pages),
                'pages': all_pages,
                'metadata': {
                    'total_files': len(files),
                    'total_char_count': total_chars,
                    'document_language': document_language,
                    'explanation_language': explanation_language
                }
            }

            # Phase 3: AI Analysis + Translation
            if not extract_only and GROQ_API_KEY:
                print('🤖 Starting AI analysis...')

                # Step 1: Analyze with Groq (in English)
                ai_result = analyze_contract(combined_text)

                if ai_result['success']:
                    analysis_english = ai_result['analysis']
                    print(f'✓ AI analysis complete (tokens: {ai_result.get("tokens_used", "N/A")})')

                    # Step 2: Translate analysis to explanation_language (if not English)
                    if explanation_language != 'en' and LINGO_DEV_API_KEY:
                        print(f'🔄 Translating analysis to {explanation_language}...')

                        try:
                            # Prepare analysis for translation
                            import uuid
                            workflow_id = str(uuid.uuid4())

                            translation_payload = {
                                'params': {
                                    'workflowId': workflow_id,
                                    'fast': False  # Use quality mode for legal content
                                },
                                'locale': {
                                    'source': 'en',
                                    'target': explanation_language
                                },
                                'data': analysis_english
                            }

                            # Call Lingo.dev API
                            translation_response = requests.post(
                                LINGO_DEV_API_URL,
                                json=translation_payload,
                                headers={
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Authorization': f'Bearer {LINGO_DEV_API_KEY}'
                                },
                                timeout=60  # Longer timeout for translation
                            )

                            if translation_response.status_code == 200:
                                analysis_translated = translation_response.json()
                                print(f'✓ Translation to {explanation_language} complete')

                                response_data['analysis'] = {
                                    'english': analysis_english,
                                    'translated': analysis_translated,
                                    'language': explanation_language
                                }
                            else:
                                print(f'⚠️  Translation failed: {translation_response.status_code}')
                                # Fallback to English only
                                response_data['analysis'] = {
                                    'english': analysis_english,
                                    'translated': None,
                                    'language': 'en',
                                    'translation_error': f'Translation failed: {translation_response.status_code}'
                                }

                        except Exception as e:
                            print(f'⚠️  Translation error: {str(e)}')
                            # Fallback to English only
                            response_data['analysis'] = {
                                'english': analysis_english,
                                'translated': None,
                                'language': 'en',
                                'translation_error': str(e)
                            }
                    else:
                        # No translation needed (English) or no Lingo.dev key
                        response_data['analysis'] = {
                            'english': analysis_english,
                            'translated': None,
                            'language': 'en'
                        }

                    # Add metadata
                    response_data['analysis']['model_used'] = ai_result.get('model_used')
                    response_data['analysis']['tokens_used'] = ai_result.get('tokens_used')

                else:
                    print(f'❌ AI analysis failed: {ai_result.get("error")}')
                    response_data['analysis'] = {
                        'success': False,
                        'error': ai_result.get('error')
                    }

            print(f'✓ Analysis complete: {len(files)} page(s), {total_chars} total characters')
            return jsonify(response_data), 200

        finally:
            # Clean up all temp files
            for temp_path in temp_paths:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
            print(f'🗑️  Cleaned up {len(temp_paths)} temp file(s)')

    except Exception as e:
        print(f'❌ Analysis error: {str(e)}')
        return jsonify({'error': str(e)}), 500


@app.route('/api/translate', methods=['POST'])
def translate():
    """
    Translate content using Lingo.dev API

    Expected request body:
    {
        "content": {...},  // Object with key-value pairs to translate
        "sourceLocale": "en",
        "targetLocale": "es"
    }
    """
    try:
        import asyncio
        from lingodotdev.engine import LingoDotDevEngine

        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        content = data.get('content')
        source_locale = data.get('sourceLocale', 'en')
        target_locale = data.get('targetLocale')

        print(f'📝 Translation request received:')
        print(f'   - Source locale: {source_locale}')
        print(f'   - Target locale: {target_locale}')
        print(f'   - Content type: {type(content)}')
        print(f'   - Content keys: {list(content.keys()) if isinstance(content, dict) else "N/A"}')

        if not content or not target_locale:
            print(f'❌ Validation failed: content={bool(content)}, target_locale={bool(target_locale)}')
            return jsonify({'error': 'Missing required fields: content and targetLocale'}), 400

        # Check if Lingo.dev API key is configured
        if not LINGO_DEV_API_KEY:
            print('❌ LINGO_DEV_API_KEY not configured')
            return jsonify({
                'success': False,
                'error': 'Translation service not configured. Please add LINGO_DEV_API_KEY to .env file.'
            }), 503

        # Use Lingo.dev Python SDK for translation
        print(f'🔄 Translating to {target_locale} using SDK...')

        async def translate():
            result = await LingoDotDevEngine.quick_translate(
                content,
                api_key=LINGO_DEV_API_KEY,
                source_locale=source_locale,
                target_locale=target_locale,
                fast=data.get('fast', True)  # Use fast mode by default
            )
            return result

        # Run async function in sync context
        translated_content = asyncio.run(translate())

        print(f'✓ Translation complete for {target_locale}')
        print(f'   - Translated content type: {type(translated_content)}')
        if isinstance(translated_content, dict):
            print(f'   - Translated content keys: {list(translated_content.keys())}')

        return jsonify({
            'success': True,
            'translated': {
                'sourceLocale': source_locale,
                'targetLocale': target_locale,
                'data': translated_content
            }
        }), 200

    except ValueError as e:
        error_msg = f'Invalid parameters: {str(e)}'
        print(f'❌ {error_msg}')
        return jsonify({
            'success': False,
            'error': error_msg
        }), 400
    except RuntimeError as e:
        error_msg = f'Translation service error: {str(e)}'
        print(f'❌ {error_msg}')
        # Check if it's an authentication error
        if 'auth' in str(e).lower() or '401' in str(e):
            error_msg = 'Invalid or expired LINGO_DEV_API_KEY. Please check your API key at https://lingo.dev'
        return jsonify({
            'success': False,
            'error': error_msg
        }), 500
    except Exception as e:
        print(f'❌ Translation error: {str(e)}')
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-audio', methods=['POST'])
def generate_audio_endpoint():
    """
    Generate TTS audio from text using Edge TTS

    Expected request body:
    {
        "text": "string",  // Text to convert to speech
        "language": "en",  // Language code (default: 'en')
        "rate": "+0%"      // Speech rate (optional, default: '+0%')
    }

    Returns: Audio file (MP3)
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        text = data.get('text')
        language = data.get('language', 'en')
        rate = data.get('rate', '+0%')

        if not text:
            return jsonify({'error': 'Missing required field: text'}), 400

        print(f'🔊 Generating audio in {language}...')

        # Generate audio
        audio_path = generate_audio(text, language, rate)

        if audio_path and os.path.exists(audio_path):
            print(f'✓ Sending audio file: {os.path.getsize(audio_path)} bytes')

            # Send file and clean up after
            response = send_file(
                audio_path,
                mimetype='audio/mpeg',
                as_attachment=True,
                download_name=f'analysis_audio_{language}.mp3'
            )

            # Schedule cleanup after sending
            @response.call_on_close
            def cleanup():
                cleanup_audio_file(audio_path)

            return response
        else:
            return jsonify({'error': 'Failed to generate audio'}), 500

    except Exception as e:
        print(f'❌ Audio generation error: {str(e)}')
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-question-message', methods=['POST'])
def generate_question_message():
    """
    Generate a formal WhatsApp/Email message for a question using Groq AI

    Expected request body:
    {
        "question": "string",  // The question to format
        "document_type": "string",  // Type of agreement
        "language": "en"  // Language code (optional, default: 'en')
    }

    Returns: Formatted message ready to send
    """
    try:
        from groq import Groq

        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        question = data.get('question')
        document_type = data.get('document_type', 'Agreement')
        language = data.get('language', 'en')

        if not question:
            return jsonify({'success': False, 'error': 'Missing required field: question'}), 400

        print(f'📧 Generating formal message for question in {language}...')

        # Create Groq client
        groq_client = Groq(api_key=GROQ_API_KEY)

        # System prompt for formal message generation
        prompt = f"""You are helping someone write a professional, polite message to ask a question about a {document_type} they're about to sign.

Generate a complete, ready-to-send message (WhatsApp/Email format) that:
1. Has a professional greeting
2. Briefly mentions the context (reviewing the {document_type})
3. Asks the specific question politely
4. Requests clarification
5. Ends with a professional closing

The question to ask: "{question}"

Language: {"English" if language == "en" else language}

Make it formal but friendly, concise (3-4 sentences max), and ready to copy-paste.
DO NOT include subject line or email headers - just the message body.
"""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )

        formatted_message = response.choices[0].message.content.strip()

        print(f'✓ Formal message generated')

        return jsonify({
            'success': True,
            'message': formatted_message
        }), 200

    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f'❌ Message generation error: {str(e)}')
        print(f'   Stack trace: {error_trace}')
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'🚀 Backend server starting on port {port}...')
    print(f'🌐 API will be available at http://localhost:{port}')
    app.run(debug=True, host='0.0.0.0', port=port)
