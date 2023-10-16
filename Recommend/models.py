from sqlalchemy import Column, TEXT, INT, BIGINT, DATETIME, FLOAT, ForeignKey, VARCHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import datetime

Base = declarative_base()

class Search(BaseModel):
    video_name : str
    video_writer : str
    song_name : str
    artist : str
    instrument : str
    release_date : datetime
    description : str

class Song(Base):
    __tablename__ = "song"

    song_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    name = Column(TEXT)
    artist = Column(TEXT)
    # code = Column(TEXT)
    genre = Column(TEXT)
    year = Column(INT)
    popular = Column(INT)
    acousticness = Column(FLOAT)
    danceability = Column(FLOAT)
    energy = Column(FLOAT)
    instrumentalness = Column(FLOAT)
    liveness = Column(FLOAT)
    loudness = Column(FLOAT)
    speechiness = Column(FLOAT)
    tempo = Column(FLOAT)
    valence = Column(FLOAT)

class Video(Base):
    __tablename__ = "video"

    video_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    name = Column(TEXT) 
    song_id = Column(BIGINT, ForeignKey("song.song_id"))
    song = relationship("Song")
    member_id = Column(BIGINT, ForeignKey("member.member_id"))
    member = relationship("Member", back_populates="videos")
    watch_count = Column(BIGINT)
    description = Column(TEXT)
    created_time = Column(DATETIME)
    video_sessions = relationship("VideoSession", back_populates="video")

class VideoSession(Base):
    __tablename__ = "video_session"

    video_session_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    video_id = Column(BIGINT, ForeignKey("video.video_id"))
    video = relationship("Video", back_populates="video_sessions")
    session_id = Column(BIGINT, ForeignKey("session.session_id"))
    session = relationship("Session")

class Session(Base):
    __tablename__ = "session"

    session_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    instrument_id = Column(BIGINT, ForeignKey("instrument.instrument_id"))
    instrument = relationship("Instrument")

class Instrument(Base):
    __tablename__ = "instrument"

    instrument_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    instrument_name = Column(VARCHAR(25))

class Member(Base):
    __tablename__ = "member"

    member_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    nick_name = Column(VARCHAR(40))
    videos = relationship("Video", back_populates="member")

class VideoWatch(Base):
    __tablename__ = "video_watch"

    video_watch_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    video_id = Column(BIGINT, ForeignKey("video.video_id"))
    video = relationship("Video")
    member_id = Column(BIGINT, ForeignKey("member.member_id"))
    member = relationship("Member")
    watched_time = Column(DATETIME)

class VideoLike(Base):
    __tablename__ = "video_like"

    video_like_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    video_id = Column(BIGINT, ForeignKey("video.video_id"))
    video = relationship("Video")
    member_id = Column(BIGINT, ForeignKey("member.member_id"))
    member = relationship("Member")

class MemberInstrument(Base):
    __tablename__ = "member_instrument"

    member_instrument_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    member_id = Column(BIGINT, ForeignKey("member.member_id"))
    member = relationship("Member")
    instrument_id = Column(BIGINT, ForeignKey("instrument.instrument_id"))
    instrument = relationship("Instrument")

class MemberGenre(Base):
    __tablename__ = "member_genre"

    member_genre_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    member_id = Column(BIGINT, ForeignKey("member.member_id"))
    member = relationship("Member")
    genre_id = Column(BIGINT, ForeignKey("music_genre.genre_id"))
    genre = relationship("Genre")

class Genre(Base):
    __tablename__ = "music_genre"

    genre_id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    genre_name = Column(VARCHAR(255))