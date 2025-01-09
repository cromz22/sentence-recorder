from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path

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
    data_dir = Path("data")
    try:
        json_file = data_dir / f"{json_stem}.json"
        with open(json_file, "r", encoding="utf-8") as f:
            content = json.load(f)

        return JSONResponse(content)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {json_stem}.json.")
