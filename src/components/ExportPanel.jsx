import React from "react";
import { Save, Download } from "../icons";

const ExportPanel = ({ blocks, exportToPNG, exportToCSV }) => (
  React.createElement('div', { className: "bg-white rounded-lg shadow-md p-4" },
    React.createElement('h3', { className: "font-semibold mb-3" }, "導出功能"),
    React.createElement('div', { className: "space-y-2" },
      React.createElement('button', {
        onClick: exportToPNG,
        className: "w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center",
        disabled: blocks.length === 0
      },
        React.createElement(Save, { className: "w-4 h-4 mr-2" }),
        "導出PNG圖片"
      ),
      React.createElement('button', {
        onClick: exportToCSV,
        className: "w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center",
        disabled: blocks.length === 0
      },
        React.createElement(Download, { className: "w-4 h-4 mr-2" }),
        "導出布局表格"
      )
    ),
    React.createElement('div', { className: "text-xs text-gray-500 mt-2 space-y-1" },
      React.createElement('p', null, "• PNG：完整會場佈局圖片，包含標題和圖例"),
      React.createElement('p', null, "• 布局表格：Excel 可開啟的座位圖表格，顯示座位編號和分配")
    )
  )
);

export default ExportPanel;
