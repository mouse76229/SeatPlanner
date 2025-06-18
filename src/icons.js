import React from "react";

// Lucide React 圖標組件
const Users = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" 
}));

const Plus = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M12 4v16m8-8H4" 
}));

const Shuffle = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
}));

const Save = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
}));

const RotateCcw = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
}));

const Edit3 = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, [
    React.createElement('path', { 
        key: "1",
        strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
        d: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" 
    }),
    React.createElement('path', { 
        key: "2",
        strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
        d: "m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" 
    })
]);

const Move = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" 
}));

const Hand = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 113 0v1m0 0V11m0-5.5a1.5 1.5 0 113 0v3m0 0V11" 
}));

const Download = () => React.createElement('svg', { 
    className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
}, React.createElement('path', { 
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, 
    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
}));


export { Users, Plus, Shuffle, Save, RotateCcw, Edit3, Move, Hand, Download };
