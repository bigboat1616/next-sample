import lightgbm as lgb
import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np

# 推論クラス
class Inference:
    def __init__(self, model_path, linked_file_path):
        self.bst = lgb.Booster(model_file=model_path)
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
        X_test = X.iloc[5]
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
            rgb["r"] = 0
            rgb["g"] = 114
            rgb["b"] = 255
        elif y_pred == 1:
            rgb["r"] = 255
            rgb["g"] = 255
            rgb["b"] = 0
        elif y_pred == 2:
            rgb["r"] = 255
            rgb["g"] = 0
            rgb["b"] = 0
        else:
            rgb["r"] = 160
            rgb["g"] = 160
            rgb["b"] = 160
        return rgb

