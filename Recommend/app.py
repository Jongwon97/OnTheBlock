import numpy as np

from DBUtil import dbUtil
from ElasticIndexer import ElasticIndexer

from load_utils import get_elastic_client, load_model
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from recommend import Recommend
from models import Search

from config import settings

# import time, math

elastic_util = get_elastic_client(settings.endpoint)
model = load_model()

app = FastAPI()

# @app.get("/songs/{song_id}")
# async def first_get(song_id: int):
#     findSong = session.query(Song).filter(Song.song_id==song_id).all()
#     return findSong

@app.get("/videos/{member_id}")
async def videoListMetaGet(member_id:int):
    """
    Pull videos from a videolist.

    Returns:
        video_recos_list: recommendations for that videolist
    """
    try:
        # 해당 비디오 데이터베이스를 csv로 저장
        dbUtil.video_data_and_save_csv()
        
        # 추천 인스턴스
        recommend_instance = Recommend('video_titles.csv', member_id)
        recommend_list = recommend_instance.recommendList

        # 데이터를 JSON 형식으로 변환하여 반환합니다.
        return JSONResponse(content=recommend_list, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
  

@app.get("/search/{keyword}/{count}")
async def search_keyword_video(keyword: str, count:int):
    try:

        # keyword 피쳐 추출
        vector = model.encode(keyword)

        # 검색 결과
        search_list = elastic_util.generate_recommendations(vector, count)

        # 데이터를 JSON 형식으로 변환하여 반환합니다.
        return JSONResponse(content=search_list, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


