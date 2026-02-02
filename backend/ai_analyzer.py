"""
AI-powered contract analysis using Groq API
Generates plain-language explanations and risk assessments
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Universal system prompt for all agreement types
UNIVERSAL_SYSTEM_PROMPT = """You are a helpful legal assistant who explains contracts in the simplest possible language for everyday people who are being asked to sign agreements.

Your audience includes job seekers, renters, blue-collar workers, and anyone who needs to understand a contract they didn't create. These people just need to know what they're agreeing to in plain, simple terms.

Analyze the contract and provide:

1. **DOCUMENT SUMMARY** (2-4 sentences in VERY SIMPLE language)
   Write the "purpose" field as a direct, easy-to-understand explanation that answers: "What am I being asked to agree to?"

   IMPORTANT GUIDELINES FOR THE PURPOSE FIELD:
   - Start with "This agreement..." or "This contract..."
   - Explain WHAT you're agreeing to and WHY it matters to you
   - Include key details: amounts, dates, main obligations, main rights
   - Use everyday words - pretend you're explaining to a friend
   - Avoid phrases like "establishes terms" - say what those terms ARE
   - Be specific: mention actual numbers, timeframes, requirements

   Example (Employment): "This agreement sets the rules for your job at [Company]. You'll work as a [Position] for $[Amount] per [Period]. It covers when you can be fired, what benefits you get, and rules about working for competitors after you leave."

   Example (Rental): "This agreement lets you rent the apartment at [Address] for $[Amount] per month. It explains your responsibilities (paying rent on time, keeping the place clean), the landlord's responsibilities (fixing major problems), and when/how you can end the lease."

   Also provide:
   - "document_type": A simple label like "Employment Agreement", "Rental Lease", "Service Contract"
   - "parties": List of who's involved (e.g., ["You (Employee)", "ABC Company (Employer)"])

2. **KEY CLAUSES** (3-5 most important clauses in simple language)
   For each clause:
   - "title": Short, clear name
   - "explanation": What it means in everyday words (1-2 sentences)
   - "impact": How it affects you directly (what you must do, what you get, what you can't do)

3. **RISK ANALYSIS** (Be honest and specific)
   - RED FLAGS: Serious risks or unfair terms that could hurt you
   - YELLOW FLAGS: Things to think carefully about or negotiate
   - POSITIVE TERMS: Good parts that protect or benefit you

   For each item:
   - "issue" or "benefit": What it is (1 sentence)
   - "why_it_matters": Why you should care (1 sentence)
   - "potential_consequence" or "why_it_helps": Real-world outcome (1 sentence)

4. **YOUR OBLIGATIONS** (What you MUST do)
   List 3-7 main things you're required to do:
   - "obligation": The requirement in simple words
   - "details": More context if needed
   - "deadline_or_requirement": When/how you must do it

5. **YOUR RIGHTS** (What you GET or CAN do)
   List 3-7 main rights or benefits you receive:
   - "right": What you get or can do
   - "details": How it works or when it applies

6. **QUESTIONS TO ASK** (before signing)
   3-5 practical questions to clarify with the other party:
   - Focus on unclear terms, missing information, or concerning clauses
   - Make questions specific and actionable

CRITICAL WRITING RULES:
- Write at a 6th-8th grade reading level
- Use short sentences (10-15 words average)
- No legal jargon - ever. Use everyday words.
- Be specific: actual amounts, dates, numbers, requirements
- Use "you" and "your" to make it personal
- Focus on practical impact: money, time, restrictions, consequences
- If you must use a legal term, immediately explain it in parentheses

Output your analysis as a JSON object with this structure:
{
  "document_summary": {
    "document_type": "string",
    "parties": ["string"],
    "purpose": "string (2-4 simple sentences starting with 'This agreement...')"
  },
  "key_clauses": [
    {
      "title": "string",
      "explanation": "string",
      "impact": "string"
    }
  ],
  "risk_analysis": {
    "red_flags": [
      {
        "issue": "string",
        "why_it_matters": "string",
        "potential_consequence": "string"
      }
    ],
    "yellow_flags": [
      {
        "issue": "string",
        "why_it_matters": "string",
        "what_to_review": "string"
      }
    ],
    "positive_terms": [
      {
        "benefit": "string",
        "why_it_helps": "string"
      }
    ]
  },
  "your_obligations": [
    {
      "obligation": "string",
      "details": "string",
      "deadline_or_requirement": "string"
    }
  ],
  "your_rights": [
    {
      "right": "string",
      "details": "string"
    }
  ],
  "questions_to_ask": [
    "string"
  ]
}

Remember: Your goal is to help someone who has never read a legal contract before understand exactly what they're signing. Make it clear, simple, and actionable.
"""


def analyze_contract(extracted_text: str, model: str = "llama-3.3-70b-versatile") -> dict:
    """
    Analyze contract text using Groq AI

    Args:
        extracted_text: The OCR-extracted contract text
        model: Groq model to use (default: llama-3.3-70b-versatile)

    Returns:
        dict: Structured analysis with summary, clauses, risks, obligations, rights, questions
    """
    try:
        print(f'🤖 Starting AI analysis with {model}...')

        # Truncate text if too long (Groq has context limits)
        max_chars = 30000  # Conservative limit
        if len(extracted_text) > max_chars:
            print(f'⚠️  Text truncated from {len(extracted_text)} to {max_chars} characters')
            extracted_text = extracted_text[:max_chars] + "\n\n[... document continues ...]"

        # Call Groq API
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": UNIVERSAL_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Analyze this contract:\n\n{extracted_text}"
                }
            ],
            temperature=0.3,  # Lower temperature for more consistent legal analysis
            max_tokens=4096,
            response_format={"type": "json_object"}  # Request JSON output
        )

        # Parse JSON response
        analysis_json = response.choices[0].message.content
        analysis = json.loads(analysis_json)

        print(f'✓ AI analysis complete')

        return {
            'success': True,
            'analysis': analysis,
            'model_used': model,
            'tokens_used': response.usage.total_tokens if hasattr(response, 'usage') else None
        }

    except json.JSONDecodeError as e:
        print(f'❌ Failed to parse AI response as JSON: {str(e)}')
        return {
            'success': False,
            'error': 'AI returned invalid JSON format',
            'raw_response': response.choices[0].message.content if 'response' in locals() else None
        }

    except Exception as e:
        print(f'❌ AI analysis error: {str(e)}')
        return {
            'success': False,
            'error': str(e)
        }


def get_analysis_summary(analysis: dict) -> str:
    """
    Generate a brief text summary of the analysis for TTS

    Args:
        analysis: The structured analysis dict

    Returns:
        str: A concise summary suitable for audio playback
    """
    if not analysis or 'document_summary' not in analysis:
        return "Analysis not available"

    summary_parts = []

    # Document overview
    doc_summary = analysis.get('document_summary', {})
    doc_type = doc_summary.get('document_type', 'agreement')
    purpose = doc_summary.get('purpose', '')
    summary_parts.append(f"This is a {doc_type}. {purpose}")

    # Risk count
    risks = analysis.get('risk_analysis', {})
    red_flags = len(risks.get('red_flags', []))
    yellow_flags = len(risks.get('yellow_flags', []))
    positive = len(risks.get('positive_terms', []))

    risk_summary = []
    if red_flags > 0:
        risk_summary.append(f"{red_flags} red flag{'s' if red_flags != 1 else ''}")
    if yellow_flags > 0:
        risk_summary.append(f"{yellow_flags} yellow flag{'s' if yellow_flags != 1 else ''}")
    if positive > 0:
        risk_summary.append(f"{positive} positive term{'s' if positive != 1 else ''}")

    if risk_summary:
        summary_parts.append(f"We found {', '.join(risk_summary)}.")

    # Top obligation
    obligations = analysis.get('your_obligations', [])
    if obligations and len(obligations) > 0:
        top_obligation = obligations[0].get('obligation', '')
        if top_obligation:
            summary_parts.append(f"Your main obligation: {top_obligation}")

    return " ".join(summary_parts)
