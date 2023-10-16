from MemberInfo import memberVideo

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler

import pandas as pd
import numpy as np

class Recommend:
    """
    
    """
    def __init__(self, df_file_name:str, member_id) -> None:
        # 데이터 프레임 가져오기
        self.df, self.float_cols = self._load_dataframe(df_file_name)
        
        self.info_instance = memberVideo(member_id)
        
        # 데이터 feature 뽑아내기
        self.feature_set = self.create_feature_set()
        
        # 해당 멤버의 취향 데이터
        self.watchList = self.info_instance.WatchVideoList()
        self.likeList = self.info_instance.LikeVideoList()
        self.uploadList = self.info_instance.UploadVideoList()
        self.favorite = self.info_instance.MemberGenreInstrument()
        
        self.recommendList = self.video_recos_list()
        
    def _load_dataframe(self, df_file_name:str) -> pd.DataFrame:
        """Loads dataframe in class instance

        Args:
            df_file_name (str): File name of the dataframe

        Returns:
            pd.DataFrame: Loaded dataframe
        """
        # if self.verbose: print("Loading dataframe...")
        try:
            df = pd.read_csv(df_file_name)
            float_cols = df.dtypes[df.dtypes == 'float64'].index.values
        except Exception as e:
            print("Error loading dataframe")
            print(e)
            exit(1)
        return df, float_cols
    
    def ohe_prep(self, column, new_name):
        """
        Create One Hot Encoded features of a specific column

        Parameters:
            df (pandas dataframe): Dataframe
            column (str): Column to be processed
            new_name (str): new column name to be used

        Returns:
            tf_df: One hot encoded features
        """

        tf_df = pd.get_dummies(self.df[column])
        feature_names = tf_df.columns
        tf_df.columns = [new_name + "|" + str(i) for i in feature_names]
        tf_df.reset_index(drop = True, inplace = True)
        return tf_df

        #function to build entire feature set
    def create_feature_set(self):
        """
        Create float_cols features of a specific column

        Parameters:
            df (pandas dataframe): Dataframe
            float_cols (list(str)): List of float columns that will be scaled

        Returns:
            final: final set of features
        """

        #tfidf instrument lists
        tfidf = TfidfVectorizer()

        tfidf_matrix =  tfidf.fit_transform(self.df['instrument'])
        instrument_df = pd.DataFrame(tfidf_matrix.toarray())
        instrument_df.columns = ['instrument' + "|" + i for i in tfidf.get_feature_names_out()]
        instrument_df.reset_index(drop = True, inplace=True)

        #explicity_ohe = ohe_prep(df, 'explicit','exp')
        year_ohe = self.ohe_prep('year_red','year') * 0.2
        popularity_ohe = self.ohe_prep('popularity_red','pop') * 0.15
        genre_ohe = self.ohe_prep('genre', 'genre') * 0.5

        #scale float columns
        floats = self.df[self.float_cols].reset_index(drop = True)
        scaler = MinMaxScaler()
        floats_scaled = pd.DataFrame(scaler.fit_transform(floats), columns = floats.columns) * 0.2
     
        #concanenate all features
        final = pd.concat([instrument_df, floats_scaled, genre_ohe, popularity_ohe, year_ohe], axis = 1)

        final['id']=self.df['id'].values

        return final

        
    def video_recos_list(self):
        """
        Parameters:
            videoList (list(video)): List of videos
            member_id : primary key of member

        Returns:
            result : video recommend list
        """    
        
        watch = self.watchList
        member_df = self.feature_set[self.feature_set['id'].isin(watch)]

        like = self.likeList
        member_df = pd.concat([member_df, self.feature_set[self.feature_set['id'].isin(like)]])

        upload = self.uploadList
        member_df = pd.concat([member_df, self.feature_set[self.feature_set['id'].isin(upload)]])

        #데이터가 없을 때 추가 연산
        if len(member_df) == 0:
            instruments, genres = self.favorite

            data = np.zeros((1, len(member_df.columns)))
            data = pd.DataFrame(data, columns=member_df.columns)
            for i in instruments:
                data["instrument|"+i.instrument_name] = 1
            for i in genres:
                data["genre|" + i.genre_name] = 1
            member_df = pd.concat([member_df,data])

        del member_df['id']
        mean = member_df.mean()

        result = self.generate_video_recos(mean)
        return result.values.tolist() 
        
    def generate_video_recos(self, features):
        """
        Pull videos from a videolist.

        Parameters:
            df (pandas dataframe): video dataframe
            features (pandas series): summarized videolist feature
            nonrelated_features (pandas dataframe): feature set of videos that are not in the selected videolist

        Returns:
            non_related_df_top5: Top 5 recommendations for that videolist
        """

        non_related_df = self.df[self.df['id'].isin(self.feature_set['id'].values)]
        non_related_df['sim'] = cosine_similarity(self.feature_set.drop('id', axis = 1).values, features.values.reshape(1, -1))[:,0]
        non_related_df_top5 = non_related_df.sort_values('sim',ascending = False).head(5)['id']

        return non_related_df_top5   




