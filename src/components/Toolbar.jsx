import React from "react";
import { Users, Plus, Edit3, Hand, Move } from "../icons";

const Toolbar = ({ mode, setMode, designMode, setDesignMode }) => (
  React.createElement(React.Fragment, null,
    React.createElement('div', { className: "bg-white rounded-lg shadow-md p-6 mb-6" },
      React.createElement('h1', { className: "text-2xl font-bold text-gray-800 mb-2 flex items-center" },
        React.createElement(Users, { className: "mr-3 text-blue-600" }),
        "會場座位設計系統"
      ),
      React.createElement('p', { className: "text-gray-600" }, "拖拉設計會場佈局，智慧分配座位，支援缺角座位設計")
    ),
    React.createElement('div', { className: "bg-white rounded-lg shadow-md p-4 mb-6" },
      React.createElement('div', { className: "flex space-x-4" },
        React.createElement('button', {
          onClick: () => setMode('design'),
          className: `px-4 py-2 rounded-md flex items-center ${mode === 'design' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`
        },
          React.createElement(Edit3, { className: "w-4 h-4 mr-2" }),
          "設計模式"
        ),
        React.createElement('button', {
          onClick: () => setMode('assign'),
          className: `px-4 py-2 rounded-md flex items-center ${mode === 'assign' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`
        },
          React.createElement(Users, { className: "w-4 h-4 mr-2" }),
          "分配模式"
        )
      ),
      mode === 'design' && React.createElement('div', { className: "flex space-x-2 mt-4 pt-4 border-t" },
        React.createElement('button', {
          onClick: () => setDesignMode('create'),
          className: `px-3 py-2 rounded-md flex items-center text-sm ${designMode === 'create' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`
        },
          React.createElement(Plus, { className: "w-4 h-4 mr-1" }),
          "創建區塊"
        ),
        React.createElement('button', {
          onClick: () => setDesignMode('move'),
          className: `px-3 py-2 rounded-md flex items-center text-sm ${designMode === 'move' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`
        },
          React.createElement(Hand, { className: "w-4 h-4 mr-1" }),
          "移動區塊"
        ),
        React.createElement('button', {
          onClick: () => setDesignMode('edit'),
          className: `px-3 py-2 rounded-md flex items-center text-sm ${designMode === 'edit' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`
        },
          React.createElement(Edit3, { className: "w-4 h-4 mr-1" }),
          "編輯座位"
        ),
        React.createElement('button', {
          onClick: () => setDesignMode('pan'),
          className: `px-3 py-2 rounded-md flex items-center text-sm ${designMode === 'pan' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`
        },
          React.createElement(Move, { className: "w-4 h-4 mr-1" }),
          "移動畫布"
        )
      )
    )
  )
);

export default Toolbar;
