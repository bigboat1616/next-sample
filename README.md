
![waitless](https://github.com/bigboat1616/next-sample/assets/86867208/7b62e8a1-0e9b-4714-91a2-8860b14b5cad)

### TL;DR


　近辺の飲食店の混雑度を可視化するマップアプリ

### こだわりリスト

- 地名を検索すると周辺の飲食店を一括表示
- 予測される混雑度に応じて表示ピンの色が変化
- LightGBLを用いた自作の混雑度予測モデル

### 使用技術
フロントエンド
- Next.js
- TypeScript
- CSS
- Google Maps API

バックエンド
- Python
- FastAPI

環境
- Docker
- vercel

### アーキテクチャ
![image](https://github.com/bigboat1616/next-sample/assets/86867208/1459c188-7d16-4c8d-9277-9caf7de4702c)


### 開発メンバー
- 上山 渉
- 荒嶋 泰舟
- 丸茂 優介

### 実行方法

```latex

```

### DEMO
![waitless_demo](https://github.com/bigboat1616/next-sample/assets/86867208/83a97df7-d04a-4ba3-a2fb-edcd24fdf152)



### 今後の展望
- データベースの用意
- 混雑度グラデーション表示


### next template

```
    # プロジェクトの作成
    pnpx create-next-app --ts frontend
    # パッケージのインストール
    pnpm install
    # 新規インストール
    pnpm install <package>
    # 開発サーバーの立ち上げ
    pnpm run dev
```


