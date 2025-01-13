from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from pathlib import Path
from pydantic import BaseModel
import base64
from typing import Optional


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


@app.get("/read-json/{task_id}")
def read_json(task_id: str):
    json_dir = Path("data/json")
    try:
        json_file = json_dir / f"{task_id}.json"
        with open(json_file, "r", encoding="utf-8") as f:
            content = json.load(f)

        return JSONResponse(content)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400, detail=f"Invalid JSON format: {task_id}.json."
        )


class Recording(BaseModel):
    sentenceId: str
    audioUrl: Optional[str]
    isCodeSwitched: bool
    isAccurateTranslation: bool
    fluency: int


@app.post("/submit-recordings/{task_id}")
async def submit_recordings(recordings: list[Recording], task_id: str):
    audio_dir = Path(f"data/audio/{task_id}")
    metadata_dir = Path(f"data/metadata")
    audio_dir.mkdir(parents=True, exist_ok=True)
    metadata_dir.mkdir(parents=True, exist_ok=True)

    if not recordings:
        raise HTTPException(status_code=400, detail="No recordings provided.")

    try:
        all_metadata = []

        for recording in recordings:
            audio_file = None

            if recording.audioUrl:
                audio_file = f"{recording.sentenceId}.webm"
                with open(audio_dir / audio_file, "wb") as f:
                    f.write(base64.b64decode(recording.audioUrl.split(",")[1]))

            metadata = {
                "sentenceId": recording.sentenceId,
                "isCodeSwitched": recording.isCodeSwitched,
                "isAccurateTranslation": recording.isAccurateTranslation,
                "fluency": recording.fluency,
                "audioFile": audio_file
            }
            all_metadata.append(metadata)

        with open(metadata_dir / f"{task_id}.json", "w") as f:
            json.dump(all_metadata, f)

        return {"message": "Recordings and metadata submitted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Submission failed: {str(e)}")
