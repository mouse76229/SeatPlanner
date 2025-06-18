import React from "react";
import { Plus } from "../icons";

const SeatTools = ({
  designMode,
  toolStyles,
  currentTool,
  setCurrentTool,
  selectedBlock,
  restoreAllSeats,
  deleteSelectedBlock,
  viewOffset,
  setViewOffset
}) => (
  React.createElement('div', { className: "bg-white rounded-lg shadow-md p-4" },
    React.createElement('h3', { className: "font-semibold mb-3" }, "設計工具"),

    designMode === 'create' && React.createElement('div', { className: "space-y-2" },
      Object.entries(toolStyles).map(([tool, style]) =>
        React.createElement('button', {
          key: tool,
          onClick: () => setCurrentTool(tool),
          className: `w-full p-3 rounded-md border-2 flex items-center ${currentTool === tool ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`
        },
          React.createElement('div', {
            className: "w-4 h-4 rounded mr-3",
            style: { backgroundColor: style.color }
          }),
          style.label
        )
      ),
      currentTool === 'seat' && React.createElement('div', { className: "mt-4 pt-4 border-t" },
        React.createElement('p', { className: "text-xs text-gray-500" },
          "座位數量完全根據拖拉區域大小決定，座位編號會自動連續排列"
        )
      )
    ),

    designMode === 'move' && React.createElement('p', { className: "text-sm text-gray-600" }, "點擊並拖動區塊來移動位置"),

    designMode === 'edit' && React.createElement('div', null,
      React.createElement('p', { className: "text-sm text-gray-600 mb-3" }, "點擊座位區塊，然後點擊個別座位來移除"),
      selectedBlock && selectedBlock.type === 'seat' && React.createElement('button', {
        onClick: restoreAllSeats,
        className: "w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
      }, "恢復所有座位")
    ),

    designMode === 'pan' && React.createElement('div', null,
      React.createElement('p', { className: "text-sm text-gray-600 mb-3" }, "拖拉畫布來移動視野，探索整個會場空間"),
      React.createElement('div', { className: "bg-blue-50 border border-blue-200 rounded-md p-3" },
        React.createElement('h4', { className: "text-sm font-medium text-blue-800 mb-2" }, "畫布位置"),
        React.createElement('div', { className: "text-xs text-blue-600" },
          React.createElement('div', null, "X偏移: " + Math.round(viewOffset.x) + "px"),
          React.createElement('div', null, "Y偏移: " + Math.round(viewOffset.y) + "px")
        ),
        React.createElement('button', {
          onClick: () => setViewOffset({ x: 0, y: 0 }),
          className: "mt-2 w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700"
        }, "重置視野")
      )
    ),

    selectedBlock && React.createElement('div', { className: "mt-4 pt-4 border-t" },
      React.createElement('p', { className: "text-sm text-gray-600 mb-2" }, "選中區塊"),
      React.createElement('p', { className: "font-medium" }, selectedBlock.label),
      React.createElement('button', {
        onClick: deleteSelectedBlock,
        className: "w-full mt-2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
      }, "刪除區塊")
    )
  )
);

export default SeatTools;
