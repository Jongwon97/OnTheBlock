from sqlalchemy import desc

from config import engineconn
from models import Video, Instrument, VideoLike, VideoWatch, MemberInstrument, \
    Genre, MemberGenre

engine = engineconn()
offset = 10

class memberVideo:
    """
    video list match to member_id
    """
    def __init__(self, member_id) -> None:
        self.member_id = member_id

    def WatchVideoList(self) -> list:
        session = engine.sessionmaker()

        list = (session.query(VideoWatch.video_id)
                .filter(VideoWatch.member_id == self.member_id)
                .order_by(desc(VideoWatch.watched_time))
                .limit(offset)
                .all())
        session.close()
        return [x[0] for x in list]

    def LikeVideoList(self) -> list:
        session = engine.sessionmaker()

        list = (session.query(VideoLike.video_id)
                .filter(VideoLike.member_id == self.member_id)
                .order_by(desc(VideoLike.video_like_id))
                .limit(offset)
                .all())
        session.close()
        return [x[0] for x in list]

    def UploadVideoList(self) -> list:
        session = engine.sessionmaker()
        list = (session.query(Video.video_id)
                .filter(Video.member_id == self.member_id)
                .order_by(desc(Video.video_id))
                .limit(offset)
                .all())
        session.close()
        return [x[0] for x in list]

    def MemberGenreInstrument(self) -> tuple:
        session = engine.sessionmaker()

        instruments = session.query(Instrument
            ).join(MemberInstrument, Instrument.instrument_id == MemberInstrument.instrument_id).filter(MemberInstrument.member_id == self.member_id).all()

        genres = session.query(Genre
            ).join(MemberGenre, Genre.genre_id == MemberGenre.genre_id).filter(MemberGenre.member_id == self.member_id).all()

        session.close()
        return instruments, genres
