from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

from dynaconf import Dynaconf

settings = Dynaconf(
    envvar_prefix="DYNACONF",
    settings_files=['settings.toml', 'secrets.toml'],
)


load_dotenv()
db_user = os.environ.get('DB_USER')
db_pw = os.environ.get('DB_PW')
db_url = os.environ.get('DB_URL')
db_port = os.environ.get('DB_PORT')
db_name = os.environ.get('DB_NAME')
DB_URL = f'mysql+pymysql://{db_user}:{db_pw}@{db_url}:{db_port}/{db_name}'

# SQLAlchemy 엔진 생성
class engineconn:

    def __init__(self):
        # self.logging()
        self.engine = create_engine(DB_URL, pool_recycle = 3600, pool_size=10)

    def logging(self):
        # SQLAlchemy 로깅 레벨 설정
        logging.basicConfig()
        logger = logging.getLogger('sqlalchemy')
        logger.setLevel(logging.INFO)  # 로깅 레벨을 설정 (INFO 레벨 이상의 SQL이 로깅됨)

    def sessionmaker(self):
        Session = sessionmaker(bind=self.engine)
        session = Session()
        return session

    def connection(self):
        conn = self.engine.connect()
        return conn