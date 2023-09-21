from fastapi import FastAPI, Depends, Path, HTTPException
from pydantic import BaseModel
from database import engineconn
from models import Song

app = FastAPI()

engine = engineconn()
session = engine.sessionmaker()


class Item(BaseModel):
    name : str
    number : int

@app.get("/{song_id}")
async def first_get(song_id: int):
    findSong = session.query(Song).filter(Song.song_id==song_id).all()
    return findSong