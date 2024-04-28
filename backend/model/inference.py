import lightgbm as lgb
import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
import pickle

# 推論クラス
class Inference:
    def __init__(self, model_path, linked_file_path):
        with open(model_path, 'rb') as f:
            self.bst = pickle.load(f)
        self.df = pd.read_csv(linked_file_path)

    def __find_csv_name(self, latitude, longitude):
        # 指定された緯度経度でデータフレームを検索
        match = self.df[(self.df['latitude'] == latitude) & (self.df['longitude'] == longitude)]
        if not match.empty:
            return match.iloc[0]['csv_name']
        else:
            return None

    def __load_data(self, dataset_path):
        # データの読み込み
        dataset = pd.read_csv(dataset_path, sep=',')
        # 欠損値のある行を除外
        dataset = dataset.dropna()
        return dataset

    def __preprocess(self, dataset):
        X = dataset.drop('target', axis=1).astype(np.float32)
        X_test = X.iloc[2]
        return X_test

    def __inference(self, input_data):
        # 予測
        y_pred = self.bst.predict(input_data, num_iteration=self.bst.best_iteration)
        return y_pred[0]

    def __get_inference(self, latitude, longitude):
        # CSVファイル名を取得
        csv_name = self.__find_csv_name(latitude, longitude)
        if csv_name is None:
            return None

        # データの読み込み
        dataset = self.__load_data(f"csv/{csv_name}.csv") # 修正
        input_data = self.__preprocess(dataset)
        y_pred = self.__inference(input_data)
        # とりあえず最大値のインデックスを返す
        y_pred_max = np.argmax(y_pred)
        return y_pred_max

    def get_rgb(self, latitude, longitude):
        # TODO: ここで予測値からRGBを生成する
        y_pred = self.__get_inference(latitude, longitude)
        rgb = {}

        if y_pred == 0:
            rgb = {"r": 96, "g": 169, "b": 23}
        elif y_pred == 1:
            rgb = {"r": 255, "g": 185, "b": 0}
        elif y_pred == 2:
            rgb = {"r": 229, "g": 20, "b": 0}
        else:
            rgb = {"r": 160, "g": 160, "b": 160}
        return rgb

