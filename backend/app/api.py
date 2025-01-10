from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from pydantic import BaseModel
import base64


app = FastAPI()

with open("app/config.json") as f:
    origins = json.load(f)["origins"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "connected to backend"}


@app.get("/read-json/{json_stem}")
def read_json(json_stem: str):
    json_dir = Path("data/json")
    try:
        json_file = json_dir / f"{json_stem}.json"
        with open(json_file, "r", encoding="utf-8") as f:
            content = json.load(f)

        return JSONResponse(content)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {json_stem}.json.")


class Recording(BaseModel):
    sentenceId: str
    audioUrl: str


@app.post("/submit-recordings")
async def submit_recordings(recordings: list[Recording]):
    audio_dir = Path("data/audio")
    audio_dir.mkdir(parents=True, exist_ok=True)

    if not recordings:
        raise HTTPException(status_code=400, detail="No recordings provided.")
    
    try:
        for recording in recordings:
            with open(audio_dir / f"{recording.sentenceId}.webm", "wb") as f:
                f.write(base64.b64decode(recording.audioUrl.split(",")[1]))
        return {"message": "Recordings submitted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Submission failed: {str(e)}")
