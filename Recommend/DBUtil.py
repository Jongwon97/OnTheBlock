from sqlalchemy.orm import joinedload
from models import Song, Video, VideoSession, Session, Instrument
from config import engineconn

import pandas as pd

engine = engineconn()

class dbUtil:
 
    @classmethod
    def video_data_and_save_csv(cls):
        videoList = cls.find_video_list()
        video_df = cls.video_list_to_dataframe(videoList)

        # save dataframe to csv
        file_name = 'video_titles.csv'
        video_df.to_csv(file_name, index=False, encoding="utf-8-sig")
    
    @classmethod
    def find_video_list(cls) -> list:
        session = engine.sessionmaker()

        """
        Returns:
            list : Song & Video & video Session & Session & Instrument 
                    Fetch join List 
        """
        findList = session.query(Video
        ).options(joinedload(Video.member)).options(joinedload(Video.song)).options(joinedload(Video.video_sessions).joinedload(VideoSession.session).joinedload(Session.instrument)).all()
        session.close()
        
        return findList

    @classmethod
    def video_list_to_dataframe(cls, videoList) -> None:
        """
        Returns:
            df : video Dataframe
            create_feature_set : final set of features
        """

        df = pd.DataFrame(
            columns=[
                        "id",
                        "video_name",
                        "video_writer",
                        "instrument",
                        "release_date",
                        "description",
                        "song_name",
                        "artist",
                        "genre",
                        "year",
                        "popular",
                        "acousticness",
                        "danceability",
                        "energy",
                        "instrumentalness",
                        "liveness",
                        "loudness",
                        "speechiness",
                        "tempo",
                        "valence"])
        for video in videoList:
            # 곡이 없는 경우
            if video.song == None:
                row = pd.DataFrame([[
                            video.video_id,
                            video.name,
                            video.member.nick_name,
                        " ".join([session.session.instrument.instrument_name for session in video.video_sessions]),
                            video.created_time,
                            video.description,
                            '',
                            '',
                            'SelfComposed',
                            2023,
                            0,
                            0.0,
                            0.0,
                            0.0,
                            0.0,
                            0.0,
                            0.0,
                            0.0,
                            0.0,
                            0.0]], columns=df.columns)

            if video.song != None:
            # 곡이 있는 경우
                row = pd.DataFrame([[
                                video.video_id,
                                video.name,
                                video.member.nick_name,
                            " ".join([session.session.instrument.instrument_name for session in video.video_sessions]),
                                video.created_time,
                                video.description,
                                video.song.name,
                                video.song.artist,
                                video.song.genre,
                                video.song.year,
                                video.song.popular,
                                video.song.acousticness,
                                video.song.danceability,
                                video.song.energy,
                                video.song.instrumentalness,
                                video.song.liveness,
                                video.song.loudness,
                                video.song.speechiness,
                                video.song.tempo,
                                video.song.valence]], columns=df.columns)
            
            df = pd.concat([df, row], ignore_index=True)

        # create 5 point buckets for popularity
        df['popularity_red'] = df['popular'].apply(lambda x: int(x/5))

        # create 10 point buckets for popularity
        df['year_red'] =  df['year'].apply(lambda x: int(x/10))

        return df
