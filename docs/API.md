# API Documentation

Complete API reference for AgreeWise backend endpoints.

Base URL: `http://localhost:5001` (development)

## Table of Contents
- [Authentication](#authentication)
- [Analyze Contract](#analyze-contract)
- [Translate Content](#translate-content)
- [Generate Audio](#generate-audio)
- [Generate Question Message](#generate-question-message)

---

## Authentication

Currently, the API does not require authentication for local development. API keys are configured on the server side via environment variables.

---

## Analyze Contract

Analyzes a contract document and returns comprehensive risk assessment.

### Endpoint
```
POST /api/analyze
```

### Request

**Content-Type:** `multipart/form-data`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | Contract document (PDF or DOCX) |
| `documentLanguage` | String | Yes | Language code (e.g., 'en', 'hi', 'es') |

**Example (cURL):**
```bash
curl -X POST http://localhost:5001/api/analyze \
  -F "file=@contract.pdf" \
  -F "documentLanguage=en"
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('documentLanguage', 'en');

const response = await fetch('http://localhost:5001/api/analyze', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

### Response

**Success (200 OK):**
```json
{
  "success": true,
  "analysis": {
    "english": {
      "document_summary": {
        "document_type": "Employment Agreement",
        "purpose": "This is an employment contract between..."
      },
      "your_obligations": [
        {
          "obligation": "Complete assigned tasks",
          "details": "Must complete work as assigned by supervisor",
          "deadline_or_requirement": "Within specified deadlines"
        }
      ],
      "your_rights": [
        {
          "right": "Receive salary payment",
          "details": "Monthly salary of $5,000"
        }
      ],
      "risk_analysis": {
        "red_flags": [
          {
            "issue": "No termination clause",
            "why_it_matters": "Difficult to exit contract",
            "potential_consequence": "May face legal action if you leave"
          }
        ],
        "yellow_flags": [
          {
            "issue": "Vague working hours",
            "why_it_matters": "Unclear expectations",
            "what_to_review": "Clarify exact working hours"
          }
        ],
        "positive_terms": [
          {
            "term": "Health insurance included",
            "why_good": "Comprehensive medical coverage"
          }
        ]
      },
      "key_clauses": [
        {
          "title": "Non-Compete Clause",
          "explanation": "Cannot work for competitors for 2 years",
          "impact": "Limits future job opportunities"
        }
      ],
      "questions_to_ask": [
        "What are the exact working hours?",
        "What happens if I need to terminate early?",
        "Are there opportunities for promotion?"
      ]
    }
  },
  "message": "Contract analyzed successfully"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

**Error (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Analysis failed: [error details]"
}
```

---

## Translate Content

Translates content from one language to another using Lingo.dev.

### Endpoint
```
POST /api/translate
```

### Request

**Content-Type:** `application/json`

**Body:**
```json
{
  "content": {
    "summary": "This is a contract",
    "whatYouMustDo": "What You Must Do"
  },
  "sourceLocale": "en",
  "targetLocale": "hi"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | Object/String | Yes | Content to translate (can be nested objects) |
| `sourceLocale` | String | Yes | Source language code (e.g., 'en') |
| `targetLocale` | String | Yes | Target language code (e.g., 'hi', 'es') |

**Supported Languages:**
- `en` - English
- `hi` - Hindi
- `es` - Spanish
- `fr` - French
- `de` - German
- `pt` - Portuguese
- `it` - Italian
- `ru` - Russian
- `ja` - Japanese
- `zh` - Chinese
- And 40+ more languages

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:5001/api/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: { summary: 'Contract Summary' },
    sourceLocale: 'en',
    targetLocale: 'hi'
  })
});

const result = await response.json();
```

### Response

**Success (200 OK):**
```json
{
  "success": true,
  "translated": {
    "sourceLocale": "en",
    "targetLocale": "hi",
    "data": {
      "summary": "अनुबंध सारांश"
    }
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

---

## Generate Audio

Generates audio from text using Google Text-to-Speech.

### Endpoint
```
POST /api/generate-audio
```

### Request

**Content-Type:** `application/json`

**Body:**
```json
{
  "text": "This is an employment contract. You must complete assigned tasks.",
  "language": "en"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | String | Yes | Text to convert to speech |
| `language` | String | Yes | Language code (e.g., 'en', 'hi') |

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:5001/api/generate-audio', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'This is a contract summary',
    language: 'en'
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
```

### Response

**Success (200 OK):**
- Content-Type: `audio/mpeg`
- Returns MP3 audio file as binary data

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**Error (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Audio generation failed"
}
```

---

## Generate Question Message

Generates a formal message for contract questions (for WhatsApp/Email).

### Endpoint
```
POST /api/generate-question-message
```

### Request

**Content-Type:** `application/json`

**Body:**
```json
{
  "question": "What are the exact working hours?",
  "document_type": "Employment Agreement",
  "language": "en"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | String | Yes | The question to ask |
| `document_type` | String | Yes | Type of contract |
| `language` | String | Yes | Language for the message |

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:5001/api/generate-question-message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: 'What are the working hours?',
    document_type: 'Employment Agreement',
    language: 'en'
  })
});

const result = await response.json();
```

### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Hello,\n\nI have reviewed the Employment Agreement and would like to clarify the following:\n\nWhat are the exact working hours?\n\nI would appreciate your response at your earliest convenience.\n\nThank you,\n[Your Name]"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Internal Server Error - Server-side error |

## Rate Limits

Currently no rate limits in local development. For production deployment, consider implementing rate limiting based on IP address or API keys.

## CORS

The backend is configured to allow requests from:
- `http://localhost:5173` (development frontend)
- `http://localhost:3000` (alternative dev port)

For production, update CORS settings in `app.py` to match your frontend domain.

---

## Need Help?

- [GitHub Issues](https://github.com/yourusername/agreewise/issues)
- [README](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
