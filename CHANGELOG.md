# Changelog

All notable changes to AgreeWise will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-05

### Added
- 📄 Initial release of AgreeWise
- 🤖 AI-powered contract analysis using Groq (Llama models)
- 📤 PDF and DOCX file upload support
- 🔍 OCR for scanned documents using EasyOCR
- ⚠️ Risk assessment with color-coded levels (Red/Yellow/Green)
- 📋 Comprehensive contract breakdown:
  - Obligations and responsibilities
  - Rights and benefits
  - Risk analysis with red/yellow flags
  - Key clauses explanation
  - Important questions to ask
- 🌍 Multi-language UI support (10 languages)
- 🔄 Content translation in 50+ languages (Lingo.dev)
- 🔊 Text-to-speech in multiple languages (Google TTS)
- 📱 Responsive design for mobile and desktop
- 🎨 Modern dark theme UI
- 💾 Privacy-focused (no data storage)
- 📧 WhatsApp/Email message generation for questions

### Technical
- Frontend: React 19 + Vite + Tailwind CSS
- Backend: Flask + Python
- State Management: React Context API
- Routing: React Router v7
- File Processing: pdfplumber, python-docx, EasyOCR
- AI: Groq API with Llama models
- Translation: Lingo.dev SDK
- Audio: Google Text-to-Speech

### Documentation
- Comprehensive README with installation guide
- Quick start guide
- Contributing guidelines
- MIT License
- Example environment files

---

## Future Releases

### [1.1.0] - Planned
- [ ] Export analysis as PDF report
- [ ] Support for TXT and RTF files
- [ ] Contract comparison feature
- [ ] Enhanced error handling and validation
- [ ] Performance optimizations

### [2.0.0] - Planned
- [ ] User accounts and saved analyses
- [ ] Contract templates library
- [ ] Legal term glossary
- [ ] Browser extension
- [ ] Mobile app (iOS/Android)

---

## Types of Changes
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security improvements
