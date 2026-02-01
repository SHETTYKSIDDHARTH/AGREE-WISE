# AgreeWise Backend

Python Flask backend for translation services using Lingo.dev API.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
Create a `.env` file with:
```
LINGO_DEV_API_KEY=your_api_key_here
PORT=5000
```

3. Run the server:
```bash
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Translation
- **POST** `/api/translate`
- Body:
```json
{
  "content": {"key": "value"},
  "sourceLocale": "en",
  "targetLocale": "es"
}
```
- Returns translated content

## Development

The server runs with Flask's debug mode enabled for development.
CORS is enabled to allow requests from the frontend (localhost:5173).
