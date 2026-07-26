import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq

load_dotenv()

app = FastAPI(
    title="NagaEd AI Username Suggestion Service",
    description="Suggests creative usernames based on user interests using an LLM.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("⚠️  WARNING: GROQ_API_KEY is not set. Requests will fail until it is configured.")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


class SuggestUsernameRequest(BaseModel):
    interests: List[str] = Field(
        ...,
        min_length=1,
        description="A list of the user's interests, e.g. ['gaming', 'hiking', 'photography']",
    )


class SuggestUsernameResponse(BaseModel):
    suggestions: List[str]


@app.get("/")
def root():
    return {"message": "NagaEd AI Username Suggestion Service is running 🚀"}


@app.post("/api/suggest-username", response_model=SuggestUsernameResponse)
def suggest_username(payload: SuggestUsernameRequest):
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="AI service is not configured. GROQ_API_KEY is missing.",
        )

    interests = [i.strip() for i in payload.interests if i.strip()]

    if not interests:
        raise HTTPException(
            status_code=400,
            detail="At least one non-empty interest is required.",
        )

    interests_text = ", ".join(interests)

    prompt = (
        "You generate creative, unique usernames for a signup form. "
        f"The user's interests are: {interests_text}. "
        "Suggest exactly 3 usernames. Rules: "
        "each username must be a single word (letters, numbers, underscores only, no spaces), "
        "under 20 characters, playful but not offensive, and clearly inspired by the interests. "
        "Respond with ONLY the 3 usernames separated by commas, and nothing else — "
        "no numbering, no explanation, no extra text."
    )

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=100,
        )
        raw_text = completion.choices[0].message.content.strip()

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to get suggestions from the AI provider: {str(error)}",
        )

    suggestions = [s.strip() for s in raw_text.split(",") if s.strip()]

    if not suggestions:
        raise HTTPException(
            status_code=502,
            detail="AI provider returned an empty or unparseable response.",
        )

    return SuggestUsernameResponse(suggestions=suggestions[:3])