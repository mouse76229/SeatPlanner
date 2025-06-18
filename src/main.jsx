import { createRoot } from 'react-dom/client';
import './index.css';
import SeatingDesigner from './SeatingDesigner';

function initApp() {
  const rootElement = document.getElementById('root');
  try {
    const root = createRoot(rootElement);
    root.render(<SeatingDesigner />);
    console.log('會場座位設計系統載入成功！');
  } catch (error) {
    console.error('應用載入失敗:', error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #dc2626;">
        <h2 style="margin-bottom: 16px;">系統載入失敗</h2>
        <p style="margin-bottom: 16px;">請檢查瀏覽器控制台查看詳細錯誤信息</p>
        <p style="font-size: 14px; color: #6b7280;">錯誤: ${error.message}</p>
        <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius:4px; cursor: pointer;">重新載入</button>
      </div>
    `;
  }
}

initApp();
