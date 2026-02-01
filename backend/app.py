from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

LINGO_DEV_API_KEY = os.getenv('LINGO_DEV_API_KEY')
LINGO_DEV_API_URL = 'https://engine.lingo.dev/i18n'


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200


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
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        content = data.get('content')
        source_locale = data.get('sourceLocale', 'en')
        target_locale = data.get('targetLocale')

        if not content or not target_locale:
            return jsonify({'error': 'Missing required fields: content and targetLocale'}), 400

        # Prepare payload for Lingo.dev API (matching SDK format)
        # Generate a simple workflow ID
        import uuid
        workflow_id = str(uuid.uuid4())

        payload = {
            'params': {
                'workflowId': workflow_id,
                'fast': data.get('fast', False)
            },
            'locale': {
                'source': source_locale,
                'target': target_locale
            },
            'data': content
        }

        # Only include reference and hints if they're provided
        if data.get('reference'):
            payload['reference'] = data.get('reference')
        if data.get('hints'):
            payload['hints'] = data.get('hints')

        # Call Lingo.dev API with Bearer token authentication
        print(f'🔄 Translating to {target_locale}...')
        response = requests.post(
            LINGO_DEV_API_URL,
            json=payload,
            headers={
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': f'Bearer {LINGO_DEV_API_KEY}'
            },
            timeout=30
        )

        if response.status_code == 200:
            translated_content = response.json()
            print(f'✓ Translation complete for {target_locale}')
            return jsonify({
                'success': True,
                'translated': translated_content
            }), 200
        else:
            error_msg = f'Lingo.dev API error: {response.status_code}'
            print(f'❌ {error_msg}')
            return jsonify({
                'success': False,
                'error': error_msg,
                'details': response.text
            }), response.status_code

    except requests.exceptions.Timeout:
        return jsonify({'error': 'Translation request timed out'}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except Exception as e:
        print(f'❌ Translation error: {str(e)}')
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'🚀 Backend server starting on port {port}...')
    print(f'🌐 API will be available at http://localhost:{port}')
    app.run(debug=True, host='0.0.0.0', port=port)
