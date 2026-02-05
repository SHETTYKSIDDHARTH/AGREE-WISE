# ⚡ Quick Start Guide

Get AgreeWise running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- API keys ready (see below)

## Get API Keys (5 minutes)

### 1. Groq API Key (Free)
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up with GitHub or email
3. Go to API Keys section
4. Click "Create API Key"
5. Copy your key

### 2. Lingo.dev API Key
1. Visit [https://lingo.dev/](https://lingo.dev/)
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Copy your API key (format: `api_xxxxx`)

## Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/agreewise.git
cd agreewise

# 2. Backend setup
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Now edit .env and add your API keys

# 3. Frontend setup (in new terminal)
cd frontend
npm install

# Create .env file
cp .env.example .env
# .env should have: VITE_BACKEND_URL=http://localhost:5001
```

## Run Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```
✅ Backend running on `http://localhost:5001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on `http://localhost:5173`

## Open Application

Visit: **http://localhost:5173**

## Test It Out

1. Click "Choose Files" or drag & drop a PDF/DOCX
2. Select document language (if not English)
3. Click "Analyze Contract"
4. Wait ~10-30 seconds for analysis
5. View results and try different languages!

## Troubleshooting

**Backend won't start?**
- Check Python version: `python --version` (need 3.9+)
- Verify API keys in `backend/.env`
- Try: `pip install -r requirements.txt` again

**Frontend won't start?**
- Check Node version: `node --version` (need 18+)
- Try: `rm -rf node_modules && npm install`

**Analysis fails?**
- Verify Groq API key is correct
- Check file size (< 10MB recommended)
- Ensure file is not password-protected

**Translation not working?**
- Verify Lingo.dev API key format: `api_xxxxx`
- Check you have credits in Lingo.dev account

## Need More Help?

See detailed [README.md](README.md) for:
- Full installation guide
- Project structure
- API documentation
- Advanced troubleshooting

---

🎉 **You're all set! Happy analyzing!**
