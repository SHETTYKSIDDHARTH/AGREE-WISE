# AgreeWise 📄

> Your AI-powered contract analyzer that helps you understand legal documents in any language

AgreeWise is an intelligent contract analysis tool that uses AI to break down complex legal documents into simple, understandable terms. Upload your contract, and get instant analysis with risk assessment, obligations, rights, and key terms - all available in multiple languages.

## 🎥 Demo Video

[![Watch Demo Video](https://img.shields.io/badge/▶-Watch%20Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/dXDQltCSCTQ)

## ✨ Features

- **📤 Document Upload**: Support for PDF and DOCX files (including scanned documents with OCR)
- **🤖 AI-Powered Analysis**: Intelligent contract analysis using Groq AI
- **⚠️ Risk Assessment**: Color-coded risk levels (Red, Yellow, Green) with detailed explanations
- **📋 Comprehensive Breakdown**:
  - Your obligations and responsibilities
  - Your rights and benefits
  - Potential risks and red flags
  - Key clauses and their impact
  - Important questions to ask before signing
- **🌍 Multi-Language Support**:
  - UI available in English, Hindi, Spanish, French, German, Portuguese, Italian, Russian, Japanese, and Chinese
  - Analysis translation in 50+ languages powered by Lingo.dev
- **🔊 Text-to-Speech**: Listen to contract summaries in your preferred language
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 Local Processing**: No data stored on servers - your contracts remain private

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **React Dropzone** - File uploads

### Backend
- **Flask** - Python web framework
- **Groq AI** - Contract analysis (using Llama models)
- **Lingo.dev** - Translation API
- **Google Text-to-Speech** - Audio generation
- **pdfplumber** - PDF text extraction
- **EasyOCR** - Optical character recognition for scanned documents
- **python-docx** - DOCX file processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** - Package manager for Node.js

### API Keys Required

You'll need to obtain the following API keys:

1. **Groq API Key** (Free tier available)
   - Sign up at [Groq Console](https://console.groq.com/)
   - Create a new API key from the dashboard

2. **Lingo.dev API Key** (Translation service)
   - Sign up at [Lingo.dev](https://lingo.dev/)
   - Get your API key from the dashboard

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/agreewise.git
cd agreewise
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Python Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2.4 Create Environment File
Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following content to `backend/.env`:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Lingo.dev Translation API
LINGO_DEV_API_KEY=your_lingo_dev_api_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

⚠️ **Important**: Replace `your_groq_api_key_here` and `your_lingo_dev_api_key_here` with your actual API keys.

#### 2.5 Additional Dependencies (for OCR)

**For macOS/Linux:**
```bash
# Install Tesseract OCR (required by EasyOCR)
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt-get install tesseract-ocr
```

**For Windows:**
- Download Tesseract installer from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
- Add Tesseract to your PATH environment variable

### 3. Frontend Setup

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Node Dependencies
```bash
npm install
# or
yarn install
```

#### 3.3 Create Environment File
Create a `.env` file in the `frontend` directory:

```bash
touch .env
```

Add the following content to `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5001
```

## 🎯 Running the Application

You need to run both the backend and frontend servers simultaneously.

### Terminal 1: Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend will start on `http://localhost:5001`

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:5173`

### 🎉 Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
agreewise/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (not in git)
│   └── venv/                  # Virtual environment (not in git)
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── LanguageSelector.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── contexts/         # React contexts
│   │   │   └── UILanguageContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalyzePage.jsx
│   │   │   └── HowToUsePage.jsx
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── .env                  # Environment variables (not in git)
│
├── test_agreements/          # Sample contracts for testing
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Document Analysis
- **POST** `/api/analyze`
  - Upload and analyze a contract document
  - Body: `multipart/form-data` with `file` and `documentLanguage`
  - Response: Analysis results with risk assessment

### Translation
- **POST** `/api/translate`
  - Translate content to target language
  - Body: `{ content, sourceLocale, targetLocale }`
  - Response: Translated content

### Audio Generation
- **POST** `/api/generate-audio`
  - Generate audio from text
  - Body: `{ text, language }`
  - Response: Audio file (MP3)

### Question Message Generation
- **POST** `/api/generate-question-message`
  - Generate formal message for contract questions
  - Body: `{ question, document_type, language }`
  - Response: Formatted message for WhatsApp/Email

## 🐛 Troubleshooting

### Backend Issues

**Issue: ModuleNotFoundError**
```bash
# Solution: Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue: API Key Errors**
```bash
# Solution: Check your .env file
# Make sure API keys are correct and have no extra spaces
# Format should be: GROQ_API_KEY=your_key_here
```

**Issue: OCR Not Working**
```bash
# Solution: Install Tesseract OCR
# macOS
brew install tesseract

# Ubuntu/Linux
sudo apt-get install tesseract-ocr

# Windows: Download from GitHub and add to PATH
```

**Issue: Port 5001 Already in Use**
```bash
# Solution: Kill the process using port 5001
# macOS/Linux
lsof -ti:5001 | xargs kill -9

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or change the port in app.py:
# app.run(host='0.0.0.0', port=5002, debug=True)
```

### Frontend Issues

**Issue: Module Not Found**
```bash
# Solution: Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

**Issue: CORS Errors**
```bash
# Solution: Make sure backend is running on http://localhost:5001
# Check VITE_BACKEND_URL in frontend/.env
```

**Issue: Port 5173 Already in Use**
```bash
# Solution: Kill the process or use a different port
npm run dev -- --port 5174
```

### Common Issues

**Issue: Translation Not Working**
- Verify Lingo.dev API key is correct in `backend/.env`
- Check API key format: should be `api_xxxxx` (no extra 'a' prefix)
- Ensure you have credits in your Lingo.dev account

**Issue: AI Analysis Failing**
- Verify Groq API key is correct in `backend/.env`
- Check Groq console for rate limits or quota
- Ensure the document is readable (not encrypted or corrupted)

**Issue: File Upload Failing**
- Check file size (max 10MB recommended)
- Ensure file format is PDF or DOCX
- Try a different browser if issues persist

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 🔒 Privacy & Security

- **No Data Storage**: Documents are processed in memory and not stored
- **Secure Processing**: Files are deleted after analysis
- **API Security**: API keys are stored in environment variables
- **CORS Protection**: Backend configured with proper CORS policies

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) - Fast AI inference
- [Lingo.dev](https://lingo.dev/) - Translation services
- [Google TTS](https://cloud.google.com/text-to-speech) - Text-to-speech
- [EasyOCR](https://github.com/JaidedAI/EasyOCR) - OCR for scanned documents
- [pdfplumber](https://github.com/jsvine/pdfplumber) - PDF text extraction

## 📧 Support

If you have any questions or run into issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/yourusername/agreewise/issues)
3. Open a new issue with detailed information about your problem


---

Made with ❤️ by SHETTYKSIDDHARTH

**⭐ If you find this project helpful, please give it a star!**
