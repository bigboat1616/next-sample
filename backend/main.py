from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
import random
from typing import List

# local
from model.inference import Inference

app = FastAPI()

# CORSを設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのサーバーアドレス
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Coordinate(BaseModel):
    lat: float
    lng: float

@app.post("/save_coordinates")
def save_coordinates(coordinatesList: List[Coordinate]):
    # 座標データをCSVに書き込む
    with open('coordinates.csv', 'w', newline='') as csvfile:
        fieldnames = ['latitude', 'longitude']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for coord in coordinatesList:
            writer.writerow({'latitude': coord.lat, 'longitude': coord.lng})

    # ランダムな混雑度を座標ごとに生成

    congestions = [generate_congestion(coord) for coord in coordinatesList]

    # 位置情報と混雑度の組み合わせを返す
    return [{"location": coord, "rgb": congestion} for coord, congestion in zip(coordinatesList, congestions)]

# 混雑度をランダムで生成（ここでMLからの出力を受け取る）
def generate_congestion(coord: Coordinate):
    # モデルとデータのパス
    model_path = 'model/lgbm_model.txt'
    linked_file_path = 'csv/link_coordinates_to_csv.csv'
    inference = Inference(model_path, linked_file_path)

    # RGBの生成
    congestion = inference.get_rgb(coord.lat, coord.lng)
    return congestion

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
