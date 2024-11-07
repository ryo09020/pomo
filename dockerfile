# ベースイメージとして公式のNode.js 18を使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# アプリケーションが使用するポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]