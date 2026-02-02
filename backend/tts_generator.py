"""
Text-to-Speech generation using gTTS (Google Text-to-Speech)
Converts analysis text to audio in multiple languages
Free, no API key required, reliable
"""

from gtts import gTTS
import os
import tempfile
from typing import Optional

# Supported language codes for gTTS
# gTTS uses simple language codes directly
SUPPORTED_LANGUAGES = {
    'en': 'en',    # English
    'es': 'es',    # Spanish
    'fr': 'fr',    # French
    'de': 'de',    # German
    'pt': 'pt',    # Portuguese
    'hi': 'hi',    # Hindi
    'zh': 'zh-CN', # Chinese (Mandarin)
    'ja': 'ja',    # Japanese
    'ko': 'ko',    # Korean
    'ar': 'ar',    # Arabic
    'ru': 'ru',    # Russian
    'it': 'it',    # Italian
    'tr': 'tr',    # Turkish
    'pl': 'pl',    # Polish
    'nl': 'nl',    # Dutch
}


def generate_audio(text: str, language: str = 'en', rate: str = '+0%') -> Optional[str]:
    """
    Generate audio from text using gTTS (Google Text-to-Speech)

    Args:
        text: The text to convert to speech
        language: Language code (e.g., 'en', 'es', 'hi')
        rate: Speech rate (ignored by gTTS, kept for compatibility)

    Returns:
        str: Path to generated audio file, or None if failed
    """
    try:
        # Get language code (fallback to English)
        lang_code = SUPPORTED_LANGUAGES.get(language, 'en')
        print(f'🔊 Generating audio in {language} (gTTS lang: {lang_code})')

        # Create temporary file for audio
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        output_path = temp_file.name
        temp_file.close()

        # Generate audio with gTTS
        tts = gTTS(text=text, lang=lang_code, slow=False)
        tts.save(output_path)

        file_size = os.path.getsize(output_path)
        print(f'✓ Audio generated: {file_size} bytes')

        return output_path

    except Exception as e:
        print(f'❌ TTS generation error: {str(e)}')
        return None


def get_available_voices(language: str = None) -> dict:
    """
    Get list of available languages

    Args:
        language: Optional language code to filter

    Returns:
        dict: Available language codes
    """
    if language:
        return {language: SUPPORTED_LANGUAGES.get(language, 'en')}
    return SUPPORTED_LANGUAGES


def cleanup_audio_file(file_path: str) -> None:
    """
    Delete temporary audio file

    Args:
        file_path: Path to audio file to delete
    """
    try:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            print(f'🗑️  Deleted audio file: {file_path}')
    except Exception as e:
        print(f'⚠️  Failed to delete audio file: {str(e)}')
