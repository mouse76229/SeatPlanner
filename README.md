# SeatPlanner

SeatPlanner 是一款用於活動或場地座位規劃的前端應用程式，提供可視化介面設計座位區塊、安排群體座位，並能匯出座位配置圖。

## 主要功能

- **座位布局設計**：在畫面上建立座位區、走道或舞台等區塊，彈性調整大小與位置。
- **座位編號與群體分配**：可根據座位編號或群體名單自動配置座位，支援快速重新編號。
- **座位圖匯出**：設計完成後可以下載 PNG 圖檔，方便列印或分享。

## 如何在本地端啟動

本專案為純前端網頁，只需瀏覽器即可執行。建議使用簡易的本地伺服器開啟，以避免部分瀏覽器的跨域限制。

1. 安裝需求：任一現代瀏覽器（Chrome、Firefox 等）。若要自行打包程式碼，需安裝 Node.js 與 Python 3。
2. 下載或複製此專案檔案到本地端。
3. （選擇性）安裝相依套件並產生 `bundle.js`：
   ```bash
   npm install
   npm run build
   ```
4. 在專案根目錄啟動伺服器：
   ```bash
   python3 -m http.server
   ```
5. 開啟瀏覽器並前往 <http://localhost:8000/index.html> 即可開始使用。

若只想快速查看，也可以直接以瀏覽器打開 `index.html` 檔案。

## 專案結構

```
SeatPlanner/
├── index.html      # 入口 HTML
├── src/            # React 原始碼
│   ├── main.jsx
│   ├── SeatingDesigner.jsx
│   └── icons.js
├── webpack.config.js
└── README.md       # 專案說明文件
```

## 貢獻方式

歡迎對此專案提出改善建議或功能新增。請遵循下列流程：

1. 先在 Issues 區討論或描述想要修改的內容。
2. Fork 專案並建立新的分支進行開發。
3. 完成後送出 Pull Request，說明變更內容與目的。

感謝任何形式的貢獻與回饋！

## 授權

本專案採用 MIT 授權 (MIT License)。詳細條款請參閱 LICENSE 檔案。
