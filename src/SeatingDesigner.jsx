import React, { useState, useEffect, useRef } from "react";
import { Plus, Shuffle, RotateCcw } from "./icons";
import Toolbar from "./components/Toolbar";
import SeatTools from "./components/SeatTools";
import ExportPanel from "./components/ExportPanel";
const SeatingDesigner = () => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('design');
  const [designMode, setDesignMode] = useState('create');
  const [currentTool, setCurrentTool] = useState('seat');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [previewBlock, setPreviewBlock] = useState(null);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 });
  
  const [blocks, setBlocks] = useState([
    {
      id: 'stage',
      type: 'stage',
      x: 300,
      y: 50,
      width: 200,
      height: 60,
      color: '#374151',
      label: '舞台/講台'
    }
  ]);
  
  const [groups, setGroups] = useState([
    { id: 1, name: '企業A團隊', size: 12, color: '#FF6B6B' },
    { id: 2, name: '學校B師生', size: 15, color: '#4ECDC4' },
    { id: 3, name: '協會C會員', size: 8, color: '#45B7D1' },
    { id: 4, name: '個人報名', size: 20, color: '#96CEB4' }
  ]);
  
  const [newGroup, setNewGroup] = useState({ name: '', size: 0 });
  const [showGroupModal, setShowGroupModal] = useState(false);
  
  const toolStyles = {
    seat: { color: '#10B981', label: '座位區' },
    aisle: { color: '#E5E7EB', label: '走道' },
    vip: { color: '#8B5CF6', label: '貴賓席' },
    stage: { color: '#374151', label: '舞台' }
  };
  
  const cellSize = 25;
  const canvasWidth = 1000; // 增加畫布寬度
  const canvasHeight = 700;  // 增加畫布高度
  
  // 重新分配所有座位編號
  const reassignSeatNumbers = (blockList) => {
    if (!blockList || blockList.length === 0) return blockList;
    
    const seatBlocks = blockList
      .filter(block => block.type === 'seat')
      .sort((a, b) => a.y - b.y);
    
    let currentNumber = 1;
    
    const updatedBlocks = blockList.map(block => {
      if (block.type === 'seat' && block.seats) {
        const updatedSeats = block.seats.map(seat => {
          if (!seat.removed) {
            return {
              ...seat,
              number: currentNumber++
            };
          }
          return seat;
        });
        
        return { ...block, seats: updatedSeats };
      }
      return block;
    });
    
    return updatedBlocks;
  };
  
  // 生成座位數據
  const generateSeats = (rows, seatsPerRow) => {
    const seats = [];
    
    for (let row = 0; row < rows; row++) {
      for (let seat = 0; seat < seatsPerRow; seat++) {
        seats.push({
          id: `${row}-${seat}`,
          number: row * seatsPerRow + seat + 1,
          row,
          seat,
          group: null,
          removed: false
        });
      }
    }
    return seats;
  };
  
  // 畫布繪製
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 簡單設置，保持比例
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 繪製網格
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 0.5;
    
    const gridStartX = (viewOffset.x % cellSize) - cellSize;
    const gridStartY = (viewOffset.y % cellSize) - cellSize;
    
    for (let x = gridStartX; x <= canvasWidth; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = gridStartY; y <= canvasHeight; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
    
    // 繪製區塊
    blocks.forEach(block => {
      const blockX = block.x + viewOffset.x;
      const blockY = block.y + viewOffset.y;
      
      if (blockX + block.width >= 0 && blockX <= canvasWidth && 
          blockY + block.height >= 0 && blockY <= canvasHeight) {
        
        ctx.fillStyle = block.color;
        ctx.fillRect(blockX, blockY, block.width, block.height);
        
        ctx.strokeStyle = selectedBlock?.id === block.id ? '#3B82F6' : '#6B7280';
        ctx.lineWidth = selectedBlock?.id === block.id ? 3 : 1;
        ctx.strokeRect(blockX, blockY, block.width, block.height);
        
        if (block.type !== 'seat') {
          ctx.fillStyle = block.type === 'aisle' ? '#374151' : '#FFFFFF';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            block.label || toolStyles[block.type].label,
            blockX + block.width / 2,
            blockY + block.height / 2 + 5
          );
        }
        
        if (block.type === 'seat' && block.seats) {
          const seatWidth = block.width / block.seatsPerRow;
          const seatHeight = block.height / block.rows;
          
          // 固定字體大小，保持可讀性
          ctx.font = '11px Arial';
          
          block.seats.forEach((seat, index) => {
            if (seat.removed) return;
            
            const row = Math.floor(index / block.seatsPerRow);
            const col = index % block.seatsPerRow;
            const seatX = blockX + col * seatWidth;
            const seatY = blockY + row * seatHeight;
            
            ctx.fillStyle = seat.group ? seat.group.color : '#F3F4F6';
            ctx.fillRect(seatX + 2, seatY + 2, seatWidth - 4, seatHeight - 4);
            
            ctx.strokeStyle = designMode === 'edit' && selectedBlock?.id === block.id ? '#EF4444' : '#D1D5DB';
            ctx.lineWidth = designMode === 'edit' && selectedBlock?.id === block.id ? 2 : 0.5;
            ctx.strokeRect(seatX + 2, seatY + 2, seatWidth - 4, seatHeight - 4);
            
            ctx.fillStyle = seat.group ? '#FFFFFF' : '#6B7280';
            ctx.textAlign = 'center';
            ctx.fillText(
              seat.number.toString(),
              seatX + seatWidth / 2,
              seatY + seatHeight / 2 + 4
            );
          });
        }
      }
    });
    
    // 繪製預覽區塊
    if (previewBlock && mode === 'design' && designMode === 'create') {
      const previewX = previewBlock.x + viewOffset.x;
      const previewY = previewBlock.y + viewOffset.y;
      
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = previewBlock.color;
      ctx.fillRect(previewX, previewY, previewBlock.width, previewBlock.height);
      
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(previewX, previewY, previewBlock.width, previewBlock.height);
      ctx.setLineDash([]);
      
      ctx.fillStyle = previewBlock.type === 'aisle' ? '#374151' : '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${previewBlock.label} (${Math.round(previewBlock.width/cellSize)}×${Math.round(previewBlock.height/cellSize)})`,
        previewX + previewBlock.width / 2,
        previewY + previewBlock.height / 2 + 6
      );
      
      ctx.globalAlpha = 1;
    }
  }, [blocks, selectedBlock, designMode, previewBlock, mode, viewOffset]);
  
  // 滑鼠事件處理
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  const getBlockAtPosition = (x, y) => {
    const worldX = x - viewOffset.x;
    const worldY = y - viewOffset.y;
    return blocks.find(block => 
      worldX >= block.x && worldX <= block.x + block.width &&
      worldY >= block.y && worldY <= block.y + block.height
    );
  };
  
  const getSeatAtPosition = (block, x, y) => {
    if (block.type !== 'seat' || !block.seats) return null;
    
    const seatWidth = block.width / block.seatsPerRow;
    const seatHeight = block.height / block.rows;
    const worldX = x - viewOffset.x;
    const worldY = y - viewOffset.y;
    const relativeX = worldX - block.x;
    const relativeY = worldY - block.y;
    
    const col = Math.floor(relativeX / seatWidth);
    const row = Math.floor(relativeY / seatHeight);
    
    if (col >= 0 && col < block.seatsPerRow && row >= 0 && row < block.rows) {
      const seatIndex = row * block.seatsPerRow + col;
      return { seat: block.seats[seatIndex], index: seatIndex };
    }
    return null;
  };
  
  // 計算所有區塊的邊界範圍
  const calculateBounds = () => {
    if (blocks.length === 0) return { minX: 0, minY: 0, maxX: canvasWidth, maxY: canvasHeight };
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    blocks.forEach(block => {
      minX = Math.min(minX, block.x);
      minY = Math.min(minY, block.y);
      maxX = Math.max(maxX, block.x + block.width);
      maxY = Math.max(maxY, block.y + block.height);
    });
    
    const margin = cellSize * 2;
    return {
      minX: minX - margin,
      minY: minY - margin,
      maxX: maxX + margin,
      maxY: maxY + margin
    };
  };
  
  // 導出會場布局 CSV 檔案（視覺化座位圖）
  const exportToCSV = () => {
    try {
      // 計算會場邊界
      const bounds = calculateBounds();
      const gridWidth = Math.ceil((bounds.maxX - bounds.minX) / cellSize);
      const gridHeight = Math.ceil((bounds.maxY - bounds.minY) / cellSize);
      
      // 創建二維陣列來表示會場布局
      const grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(''));
      
      // 填入區塊資訊
      blocks.forEach(block => {
        const startX = Math.floor((block.x - bounds.minX) / cellSize);
        const startY = Math.floor((block.y - bounds.minY) / cellSize);
        const endX = Math.min(gridWidth - 1, Math.floor((block.x + block.width - bounds.minX) / cellSize));
        const endY = Math.min(gridHeight - 1, Math.floor((block.y + block.height - bounds.minY) / cellSize));
        
        if (block.type === 'seat' && block.seats) {
          // 處理座位區塊 - 顯示座位編號
          const blockCols = Math.floor(block.width / cellSize);
          const blockRows = Math.floor(block.height / cellSize);
          const seatsPerCol = Math.ceil(block.seatsPerRow / blockCols);
          const seatsPerRowInGrid = Math.ceil(block.rows / blockRows);
          
          for (let gridY = startY; gridY <= endY; gridY++) {
            for (let gridX = startX; gridX <= endX; gridX++) {
              // 計算這個網格位置對應的座位
              const relativeX = gridX - startX;
              const relativeY = gridY - startY;
              
              // 計算座位在原始座位陣列中的位置
              const seatCol = Math.floor((relativeX * block.seatsPerRow) / blockCols);
              const seatRow = Math.floor((relativeY * block.rows) / blockRows);
              
              if (seatRow < block.rows && seatCol < block.seatsPerRow) {
                const seatIndex = seatRow * block.seatsPerRow + seatCol;
                const seat = block.seats[seatIndex];
                
                if (seat && !seat.removed) {
                  let cellContent = seat.number.toString();
                  if (seat.group) {
                    cellContent += `[${seat.group.name}]`;
                  }
                  grid[gridY][gridX] = cellContent;
                } else {
                  grid[gridY][gridX] = '■'; // 被移除的座位用實心方塊表示
                }
              }
            }
          }
        } else {
          // 處理其他區塊（舞台、走道、貴賓席）
          const blockLabel = block.label || toolStyles[block.type]?.label || block.type;
          for (let gridY = startY; gridY <= endY; gridY++) {
            for (let gridX = startX; gridX <= endX; gridX++) {
              if (block.type === 'aisle') {
                grid[gridY][gridX] = '---'; // 走道用橫線表示
              } else if (block.type === 'stage') {
                grid[gridY][gridX] = '舞台';
              } else if (block.type === 'vip') {
                grid[gridY][gridX] = 'VIP';
              } else {
                grid[gridY][gridX] = blockLabel;
              }
            }
          }
        }
      });
      
      // 生成 CSV 內容
      let csvContent = '\ufeff'; // UTF-8 BOM
      
      // 添加標題
      csvContent += '會場座位布局圖\n';
      csvContent += `生成時間: ${new Date().toLocaleString('zh-TW')}\n`;
      csvContent += `總座位數: ${totalSeats} | 已分配: ${assignedSeats} | 剩餘: ${totalSeats - assignedSeats}\n`;
      csvContent += '\n';
      
      // 添加圖例說明
      csvContent += '圖例說明:\n';
      csvContent += '數字 = 座位編號, [群組名] = 已分配群組, ■ = 已移除座位\n';
      csvContent += '--- = 走道, 舞台 = 舞台區域, VIP = 貴賓席\n';
      csvContent += '\n';
      
      // 添加群組色彩對照表
      if (groups.length > 0) {
        csvContent += '群組對照表:\n';
        groups.forEach(group => {
          const assignedCount = blocks
            .filter(block => block.type === 'seat')
            .reduce((sum, block) => 
              sum + (block.seats ? block.seats.filter(seat => !seat.removed && seat.group?.id === group.id).length : 0), 0);
          csvContent += `[${group.name}] = ${assignedCount}/${group.size}人\n`;
        });
        csvContent += '\n';
      }
      
      csvContent += '座位布局:\n';
      
      // 添加列標題（A, B, C...）
      let headerRow = ',';
      for (let x = 0; x < gridWidth; x++) {
        const colLabel = String.fromCharCode(65 + (x % 26)); // A-Z循環
        headerRow += `${colLabel},`;
      }
      csvContent += headerRow + '\n';
      
      // 添加布局數據
      for (let y = 0; y < gridHeight; y++) {
        let row = `${y + 1},`; // 行號
        for (let x = 0; x < gridWidth; x++) {
          const cellValue = grid[y][x] || '';
          // 處理包含逗號的內容
          const escapedValue = cellValue.includes(',') ? `"${cellValue}"` : cellValue;
          row += `${escapedValue},`;
        }
        csvContent += row + '\n';
      }
      
      // 在底部添加統計資訊
      csvContent += '\n統計資訊:\n';
      csvContent += `會場尺寸,${gridWidth} x ${gridHeight} 格\n`;
      csvContent += `區塊總數,${blocks.length}\n`;
      csvContent += `座位區塊,${blocks.filter(b => b.type === 'seat').length}\n`;
      csvContent += `其他區塊,${blocks.filter(b => b.type !== 'seat').length}\n`;
      
      // 創建並下載檔案
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `會場布局圖_${new Date().toISOString().slice(0, 10)}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('會場布局 CSV 檔案導出成功');
    } catch (error) {
      console.error('會場布局導出失敗:', error);
      alert('會場布局導出失敗，請檢查瀏覽器控制台了解詳情');
    }
  };
  
  // 導出PNG圖片
  const exportToPNG = () => {
    try {
      const bounds = calculateBounds();
      const exportWidth = bounds.maxX - bounds.minX;
      const exportHeight = bounds.maxY - bounds.minY;
      
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = exportWidth;
      exportCanvas.height = exportHeight;
      const exportCtx = exportCanvas.getContext('2d');
      
      exportCtx.fillStyle = '#FFFFFF';
      exportCtx.fillRect(0, 0, exportWidth, exportHeight);
      
      exportCtx.strokeStyle = '#E5E7EB';
      exportCtx.lineWidth = 1;
      
      for (let x = 0; x <= exportWidth; x += cellSize) {
        exportCtx.beginPath();
        exportCtx.moveTo(x, 0);
        exportCtx.lineTo(x, exportHeight);
        exportCtx.stroke();
      }
      for (let y = 0; y <= exportHeight; y += cellSize) {
        exportCtx.beginPath();
        exportCtx.moveTo(0, y);
        exportCtx.lineTo(exportWidth, y);
        exportCtx.stroke();
      }
      
      blocks.forEach(block => {
        const blockX = block.x - bounds.minX;
        const blockY = block.y - bounds.minY;
        
        exportCtx.fillStyle = block.color;
        exportCtx.fillRect(blockX, blockY, block.width, block.height);
        
        exportCtx.strokeStyle = '#6B7280';
        exportCtx.lineWidth = 2;
        exportCtx.strokeRect(blockX, blockY, block.width, block.height);
        
        if (block.type !== 'seat') {
          exportCtx.fillStyle = block.type === 'aisle' ? '#374151' : '#FFFFFF';
          exportCtx.font = 'bold 16px Arial';
          exportCtx.textAlign = 'center';
          exportCtx.fillText(
            block.label || toolStyles[block.type].label,
            blockX + block.width / 2,
            blockY + block.height / 2 + 6
          );
        }
        
        if (block.type === 'seat' && block.seats) {
          const seatWidth = block.width / block.seatsPerRow;
          const seatHeight = block.height / block.rows;
          
          exportCtx.font = '12px Arial';
          
          block.seats.forEach((seat, index) => {
            if (seat.removed) return;
            
            const row = Math.floor(index / block.seatsPerRow);
            const col = index % block.seatsPerRow;
            const seatX = blockX + col * seatWidth;
            const seatY = blockY + row * seatHeight;
            
            exportCtx.fillStyle = seat.group ? seat.group.color : '#F3F4F6';
            exportCtx.fillRect(seatX + 2, seatY + 2, seatWidth - 4, seatHeight - 4);
            
            exportCtx.strokeStyle = '#D1D5DB';
            exportCtx.lineWidth = 1;
            exportCtx.strokeRect(seatX + 2, seatY + 2, seatWidth - 4, seatHeight - 4);
            
            exportCtx.fillStyle = seat.group ? '#FFFFFF' : '#6B7280';
            exportCtx.textAlign = 'center';
            exportCtx.fillText(
              seat.number.toString(),
              seatX + seatWidth / 2,
              seatY + seatHeight / 2 + 4
            );
          });
        }
      });
      
      const titleHeight = 60;
      const legendHeight = 100;
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = exportWidth;
      finalCanvas.height = exportHeight + titleHeight + legendHeight;
      const finalCtx = finalCanvas.getContext('2d');
      
      finalCtx.fillStyle = '#FFFFFF';
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      finalCtx.fillStyle = '#1F2937';
      finalCtx.font = 'bold 24px Arial';
      finalCtx.textAlign = 'center';
      finalCtx.fillText('會場座位配置圖', finalCanvas.width / 2, 35);
      
      finalCtx.drawImage(exportCanvas, 0, titleHeight);
      
      const legendY = titleHeight + exportHeight + 20;
      finalCtx.fillStyle = '#374151';
      finalCtx.font = 'bold 16px Arial';
      finalCtx.textAlign = 'left';
      finalCtx.fillText('圖例：', 20, legendY);
      
      let legendX = 20;
      const legendItemHeight = 25;
      
      Object.entries(toolStyles).forEach(([tool, style], index) => {
        const itemY = legendY + 25 + Math.floor(index / 4) * legendItemHeight;
        const itemX = legendX + (index % 4) * 150;
        
        finalCtx.fillStyle = style.color;
        finalCtx.fillRect(itemX, itemY - 12, 16, 16);
        finalCtx.strokeStyle = '#6B7280';
        finalCtx.lineWidth = 1;
        finalCtx.strokeRect(itemX, itemY - 12, 16, 16);
        
        finalCtx.fillStyle = '#374151';
        finalCtx.font = '12px Arial';
        finalCtx.fillText(style.label, itemX + 20, itemY);
      });
      
      if (mode === 'assign' && groups.length > 0) {
        finalCtx.fillStyle = '#374151';
        finalCtx.font = 'bold 14px Arial';
        finalCtx.fillText('群體分配：', 20, legendY + 60);
        
        groups.forEach((group, index) => {
          const itemY = legendY + 80 + Math.floor(index / 4) * legendItemHeight;
          const itemX = 20 + (index % 4) * 150;
          
          finalCtx.fillStyle = group.color;
          finalCtx.fillRect(itemX, itemY - 12, 16, 16);
          finalCtx.strokeStyle = '#6B7280';
          finalCtx.lineWidth = 1;
          finalCtx.strokeRect(itemX, itemY - 12, 16, 16);
          
          finalCtx.fillStyle = '#374151';
          finalCtx.font = '12px Arial';
          finalCtx.fillText(`${group.name} (${group.size}人)`, itemX + 20, itemY);
        });
      }
      
      finalCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `會場座位圖_${new Date().toISOString().slice(0, 10)}.png`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log('PNG圖片導出成功');
        } else {
          throw new Error('無法創建圖片blob');
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('PNG導出失敗:', error);
      alert('PNG圖片導出失敗，請檢查瀏覽器控制台了解詳情');
    }
  };
  
  const handleMouseDown = (e) => {
    const coords = getCanvasCoordinates(e);
    
    if (mode === 'design') {
      if (designMode === 'pan') {
        setIsCanvasDragging(true);
        setCanvasDragStart(coords);
      } else {
        const clickedBlock = getBlockAtPosition(coords.x, coords.y);
        
        if (designMode === 'create') {
          if (!clickedBlock) {
            setIsDragging(true);
            setDragStart(coords);
            setSelectedBlock(null);
            setPreviewBlock(null);
          }
        } else if (designMode === 'move') {
          if (clickedBlock) {
            setDraggedBlock(clickedBlock);
            setSelectedBlock(clickedBlock);
            const worldX = coords.x - viewOffset.x;
            const worldY = coords.y - viewOffset.y;
            setDragOffset({
              x: worldX - clickedBlock.x,
              y: worldY - clickedBlock.y
            });
          }
        } else if (designMode === 'edit') {
          if (clickedBlock && clickedBlock.type === 'seat') {
            setSelectedBlock(clickedBlock);
            const seatResult = getSeatAtPosition(clickedBlock, coords.x, coords.y);
            if (seatResult && !seatResult.seat.removed) {
              removeSeat(clickedBlock.id, seatResult.index);
            }
          } else {
            setSelectedBlock(clickedBlock);
          }
        }
      }
    }
  };
  
  const handleMouseMove = (e) => {
    const coords = getCanvasCoordinates(e);
    
    if (mode === 'design') {
      if (designMode === 'pan' && isCanvasDragging) {
        const deltaX = coords.x - canvasDragStart.x;
        const deltaY = coords.y - canvasDragStart.y;
        setViewOffset({
          x: viewOffset.x + deltaX,
          y: viewOffset.y + deltaY
        });
        setCanvasDragStart(coords);
      } else if (designMode === 'create' && isDragging) {
        const width = Math.abs(coords.x - dragStart.x);
        const height = Math.abs(coords.y - dragStart.y);
        const x = Math.min(coords.x, dragStart.x);
        const y = Math.min(coords.y, dragStart.y);
        
        const worldX = x - viewOffset.x;
        const worldY = y - viewOffset.y;
        
        const gridX = Math.round(worldX / cellSize) * cellSize;
        const gridY = Math.round(worldY / cellSize) * cellSize;
        const gridWidth = Math.round(width / cellSize) * cellSize;
        const gridHeight = Math.round(height / cellSize) * cellSize;
        
        if (gridWidth > 0 && gridHeight > 0) {
          const preview = {
            x: gridX,
            y: gridY,
            width: gridWidth,
            height: gridHeight,
            color: toolStyles[currentTool].color,
            label: toolStyles[currentTool].label,
            type: currentTool
          };
          
          if (currentTool === 'seat') {
            const minSeatSize = 25;
            const maxSeatsPerRow = Math.floor(gridWidth / minSeatSize);
            const maxRows = Math.floor(gridHeight / minSeatSize);
            const seatsPerRow = Math.max(1, maxSeatsPerRow);
            const rows = Math.max(1, maxRows);
            const totalSeats = rows * seatsPerRow;
            
            preview.label = `座位區 (${rows}行×${seatsPerRow}位=${totalSeats}座位)`;
          }
          
          setPreviewBlock(preview);
        }
      } else if (designMode === 'move' && draggedBlock) {
        const worldX = coords.x - viewOffset.x;
        const worldY = coords.y - viewOffset.y;
        const newX = Math.round((worldX - dragOffset.x) / cellSize) * cellSize;
        const newY = Math.round((worldY - dragOffset.y) / cellSize) * cellSize;
        
        setBlocks(blocks.map(block => 
          block.id === draggedBlock.id 
            ? { ...block, x: newX, y: newY }
            : block
        ));
      } else {
        setPreviewBlock(null);
      }
    } else {
      setPreviewBlock(null);
    }
  };
  
  const handleMouseUp = (e) => {
    const coords = getCanvasCoordinates(e);
    
    if (mode === 'design') {
      if (designMode === 'pan' && isCanvasDragging) {
        setIsCanvasDragging(false);
      } else if (designMode === 'create' && isDragging) {
        const width = Math.abs(coords.x - dragStart.x);
        const height = Math.abs(coords.y - dragStart.y);
        const x = Math.min(coords.x, dragStart.x);
        const y = Math.min(coords.y, dragStart.y);
        
        if (width > 20 && height > 20) {
          const worldX = x - viewOffset.x;
          const worldY = y - viewOffset.y;
          const gridWidth = Math.round(width / cellSize) * cellSize;
          const gridHeight = Math.round(height / cellSize) * cellSize;
          
          const newBlock = {
            id: Date.now().toString(),
            type: currentTool,
            x: Math.round(worldX / cellSize) * cellSize,
            y: Math.round(worldY / cellSize) * cellSize,
            width: gridWidth,
            height: gridHeight,
            color: toolStyles[currentTool].color,
            label: toolStyles[currentTool].label
          };
          
          if (currentTool === 'seat') {
            const minSeatSize = 25;
            const maxSeatsPerRow = Math.floor(gridWidth / minSeatSize);
            const maxRows = Math.floor(gridHeight / minSeatSize);
            
            const seatsPerRow = Math.max(1, maxSeatsPerRow);
            const rows = Math.max(1, maxRows);
            
            newBlock.rows = rows;
            newBlock.seatsPerRow = seatsPerRow;
            newBlock.seats = generateSeats(rows, seatsPerRow);
          }
          
          const updatedBlocks = [...blocks, newBlock];
          
          if (currentTool === 'aisle') {
            handleAisleConflicts(newBlock, updatedBlocks);
          } else {
            setBlocks(updatedBlocks);
            if (currentTool === 'seat') {
              setTimeout(() => {
                setBlocks(prevBlocks => {
                  const reassigned = reassignSeatNumbers(prevBlocks);
                  return reassigned;
                });
              }, 10);
            }
          }
          
          setSelectedBlock(newBlock);
        }
        
        setPreviewBlock(null);
      } else if (designMode === 'move' && draggedBlock) {
        if (draggedBlock.type === 'aisle') {
          handleAisleConflicts(draggedBlock, blocks);
        } else if (draggedBlock.type === 'seat') {
          setTimeout(() => {
            setBlocks(prevBlocks => reassignSeatNumbers(prevBlocks));
          }, 10);
        }
        setDraggedBlock(null);
      }
    }
    setIsDragging(false);
  };
  
  // 處理走道與座位區的衝突
  const handleAisleConflicts = (aisleBlock, blockList) => {
    const updatedBlocks = blockList.map(block => {
      if (block.type === 'seat' && block.seats) {
        const updatedSeats = block.seats.map(seat => {
          if (seat.removed) return seat;
          
          const seatWidth = block.width / block.seatsPerRow;
          const seatHeight = block.height / block.rows;
          const seatIndex = block.seats.indexOf(seat);
          const row = Math.floor(seatIndex / block.seatsPerRow);
          const col = seatIndex % block.seatsPerRow;
          const seatX = block.x + col * seatWidth;
          const seatY = block.y + row * seatHeight;
          
          const isOverlapping = !(
            seatX + seatWidth <= aisleBlock.x ||
            seatX >= aisleBlock.x + aisleBlock.width ||
            seatY + seatHeight <= aisleBlock.y ||
            seatY >= aisleBlock.y + aisleBlock.height
          );
          
          if (isOverlapping) {
            return { ...seat, removed: true };
          }
          return seat;
        });
        
        return { ...block, seats: updatedSeats };
      }
      return block;
    });
    
    setBlocks(updatedBlocks);
    setTimeout(() => {
      setBlocks(prevBlocks => reassignSeatNumbers(prevBlocks));
    }, 10);
  };
  
  // 移除單個座位
  const removeSeat = (blockId, seatIndex) => {
    const updatedBlocks = blocks.map(block => {
      if (block.id === blockId && block.seats) {
        const updatedSeats = [...block.seats];
        updatedSeats[seatIndex] = { ...updatedSeats[seatIndex], removed: true };
        return { ...block, seats: updatedSeats };
      }
      return block;
    });
    
    setBlocks(updatedBlocks);
    setTimeout(() => {
      setBlocks(prevBlocks => reassignSeatNumbers(prevBlocks));
    }, 10);
  };
  
  // 恢復選中區塊的所有座位
  const restoreAllSeats = () => {
    if (selectedBlock && selectedBlock.type === 'seat') {
      const updatedBlocks = blocks.map(block => {
        if (block.id === selectedBlock.id && block.seats) {
          const updatedSeats = block.seats.map(seat => ({ ...seat, removed: false }));
          return { ...block, seats: updatedSeats };
        }
        return block;
      });
      
      setBlocks(updatedBlocks);
      setTimeout(() => {
        setBlocks(prevBlocks => reassignSeatNumbers(prevBlocks));
      }, 10);
    }
  };
  
  // 刪除選中的區塊
  const deleteSelectedBlock = () => {
    if (selectedBlock) {
      const updatedBlocks = blocks.filter(block => block.id !== selectedBlock.id);
      
      setBlocks(updatedBlocks);
      
      if (selectedBlock.type === 'seat') {
        setTimeout(() => {
          setBlocks(prevBlocks => reassignSeatNumbers(prevBlocks));
        }, 10);
      }
      
      setSelectedBlock(null);
    }
  };
  
  // 自動分配座位
  const autoAssignSeats = () => {
    const seatBlocks = blocks.filter(block => block.type === 'seat');
    const updatedBlocks = [...blocks];
    
    let groupIndex = 0;
    let seatIndex = 0;
    
    seatBlocks.forEach(block => {
      if (block.seats) {
        block.seats.forEach(seat => {
          if (!seat.removed) {
            seat.group = null;
          }
        });
      }
    });
    
    groups.forEach(group => {
      let assigned = 0;
      
      while (assigned < group.size && groupIndex < seatBlocks.length) {
        const currentBlock = seatBlocks[groupIndex];
        const availableSeats = currentBlock.seats.filter(seat => !seat.removed);
        
        while (assigned < group.size && seatIndex < availableSeats.length) {
          availableSeats[seatIndex].group = group;
          assigned++;
          seatIndex++;
        }
        
        if (seatIndex >= availableSeats.length) {
          groupIndex++;
          seatIndex = 0;
        }
      }
    });
    
    setBlocks(updatedBlocks);
  };
  
  // 清空座位分配
  const clearAssignments = () => {
    const updatedBlocks = blocks.map(block => {
      if (block.type === 'seat' && block.seats) {
        return {
          ...block,
          seats: block.seats.map(seat => ({ ...seat, group: null }))
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };
  
  // 計算統計數據
  const totalSeats = blocks
    .filter(block => block.type === 'seat')
    .reduce((sum, block) => sum + (block.seats ? block.seats.filter(seat => !seat.removed).length : 0), 0);
  
  const assignedSeats = blocks
    .filter(block => block.type === 'seat')
    .reduce((sum, block) => 
      sum + (block.seats ? block.seats.filter(seat => !seat.removed && seat.group).length : 0), 0);
  
  const totalNeeded = groups.reduce((sum, group) => sum + group.size, 0);
  
  // 新增群體
  const addGroup = () => {
    if (newGroup.name && newGroup.size > 0) {
      const group = {
        id: Date.now(),
        name: newGroup.name,
        size: parseInt(newGroup.size),
        color: generateColor()
      };
      setGroups([...groups, group]);
      setNewGroup({ name: '', size: 0 });
      setShowGroupModal(false);
    }
  };
  
  const generateColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const removeGroup = (groupId) => {
    setGroups(groups.filter(g => g.id !== groupId));
    clearAssignments();
  };
  
  return React.createElement('div', { className: "min-h-screen bg-gray-50 p-4" },
    React.createElement('div', { className: "max-w-7xl mx-auto" },
      React.createElement(Toolbar, { mode, setMode, designMode, setDesignMode }),
      
      React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-4 gap-6" },
        // 左側工具面板
        React.createElement('div', { className: "space-y-6" },
          // 設計工具
          mode === 'design' && React.createElement(SeatTools, {
            designMode,
            toolStyles,
            currentTool,
            setCurrentTool,
            selectedBlock,
            restoreAllSeats,
            deleteSelectedBlock,
            viewOffset,
            setViewOffset
          }),
          
          // 群體管理
          mode === 'assign' && React.createElement('div', { className: "bg-white rounded-lg shadow-md p-4" },
            React.createElement('div', { className: "flex justify-between items-center mb-3" },
              React.createElement('h3', { className: "font-semibold" }, "報名群體"),
              React.createElement('button', {
                onClick: () => setShowGroupModal(true),
                className: "bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center text-sm"
              },
                React.createElement(Plus, { className: "w-3 h-3 mr-1" }),
                "新增"
              )
            ),
            
            React.createElement('div', { className: "space-y-2" },
              groups.map(group =>
                React.createElement('div', { key: group.id, className: "border rounded-lg p-2", style: {borderColor: group.color} },
                  React.createElement('div', { className: "flex items-center justify-between" },
                    React.createElement('div', { className: "flex items-center" },
                      React.createElement('div', { 
                        className: "w-3 h-3 rounded-full mr-2",
                        style: {backgroundColor: group.color}
                      }),
                      React.createElement('div', null,
                        React.createElement('div', { className: "font-medium text-sm" }, group.name),
                        React.createElement('div', { className: "text-xs text-gray-600" }, group.size + " 人")
                      )
                    ),
                    React.createElement('button', {
                      onClick: () => removeGroup(group.id),
                      className: "text-red-500 hover:text-red-700 text-sm"
                    }, "✕")
                  )
                )
              )
            )
          ),
          
          // 統計資訊
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-4" },
            React.createElement('h3', { className: "font-semibold mb-3" }, "統計資訊"),
            React.createElement('div', { className: "space-y-2 text-sm" },
              React.createElement('div', { className: "flex justify-between" },
                React.createElement('span', null, "可用座位："),
                React.createElement('span', { className: "font-medium" }, totalSeats)
              ),
              mode === 'assign' && [
                React.createElement('div', { className: "flex justify-between", key: "needed" },
                  React.createElement('span', null, "需求人數："),
                  React.createElement('span', { className: "font-medium" }, totalNeeded)
                ),
                React.createElement('div', { className: "flex justify-between", key: "assigned" },
                  React.createElement('span', null, "已分配："),
                  React.createElement('span', { className: "font-medium text-green-600" }, assignedSeats)
                ),
                React.createElement('div', { className: "flex justify-between", key: "remaining" },
                  React.createElement('span', null, "剩餘座位："),
                  React.createElement('span', { className: "font-medium" }, totalSeats - assignedSeats)
                )
              ]
            )
          ),
          
          // 導出功能
          React.createElement(ExportPanel, { blocks, exportToPNG, exportToCSV }),
          
          // 操作按鈕
          mode === 'assign' && React.createElement('div', { className: "bg-white rounded-lg shadow-md p-4" },
            React.createElement('h3', { className: "font-semibold mb-3" }, "操作"),
            React.createElement('div', { className: "space-y-2" },
              React.createElement('button', {
                onClick: autoAssignSeats,
                className: "w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              },
                React.createElement(Shuffle, { className: "w-4 h-4 mr-2" }),
                "自動分配"
              ),
              React.createElement('button', {
                onClick: clearAssignments,
                className: "w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center"
              },
                React.createElement(RotateCcw, { className: "w-4 h-4 mr-2" }),
                "清空分配"
              )
            )
          )
        ),
        
        // 主畫布區域
        React.createElement('div', { className: "lg:col-span-3" },
          React.createElement('div', { className: "bg-white rounded-lg shadow-md p-4" },
            React.createElement('h3', { className: "font-semibold mb-4" }, "會場佈局設計"),
            
            mode === 'design' && React.createElement('div', { className: "text-sm text-gray-600 mb-4" },
              designMode === 'create' && "選擇工具後，在畫布上拖拉滑鼠來創建區塊。座位區塊的數量會根據拖拉範圍自動調整",
              designMode === 'move' && "點擊並拖動區塊來移動位置，走道會自動處理座位衝突",
              designMode === 'edit' && "點擊座位區塊選中，然後點擊個別座位來移除（紅框表示可編輯）",
              designMode === 'pan' && "拖拉畫布來移動視野，設計超大型會場佈局"
            ),
            
            React.createElement('div', { className: "border-2 border-gray-300 rounded-lg overflow-hidden" },
              React.createElement('canvas', {
                ref: canvasRef,
                width: canvasWidth,
                height: canvasHeight,
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp,
                className: 
                  designMode === 'create' ? 'cursor-crosshair' : 
                  designMode === 'move' ? 'cursor-move' : 
                  designMode === 'pan' ? (isCanvasDragging ? 'cursor-grabbing' : 'cursor-grab') :
                  'cursor-pointer',
                style: { display: 'block', maxWidth: '100%', height: 'auto' }
              })
            ),
            
            // 圖例
            React.createElement('div', { className: "mt-4 pt-4 border-t" },
              React.createElement('h4', { className: "font-medium mb-3" }, "圖例"),
              React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4" },
                Object.entries(toolStyles).map(([tool, style]) =>
                  React.createElement('div', { key: tool, className: "flex items-center" },
                    React.createElement('div', { 
                      className: "w-4 h-4 rounded mr-2",
                      style: {backgroundColor: style.color}
                    }),
                    React.createElement('span', { className: "text-sm" }, style.label)
                  )
                ).concat(
                  mode === 'assign' ? groups.map(group =>
                    React.createElement('div', { key: group.id, className: "flex items-center" },
                      React.createElement('div', { 
                        className: "w-4 h-4 rounded mr-2",
                        style: {backgroundColor: group.color}
                      }),
                      React.createElement('span', { className: "text-sm" }, group.name)
                    )
                  ) : []
                )
              )
            )
          )
        )
      ),
      
      // 新增群體模態框
      showGroupModal && React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" },
        React.createElement('div', { className: "bg-white rounded-lg p-6 w-96" },
          React.createElement('h3', { className: "text-lg font-semibold mb-4" }, "新增報名群體"),
          React.createElement('div', { className: "space-y-4" },
            React.createElement('div', null,
              React.createElement('label', { className: "block text-sm font-medium mb-1" }, "群體名稱"),
              React.createElement('input', {
                type: "text",
                value: newGroup.name,
                onChange: (e) => setNewGroup({...newGroup, name: e.target.value}),
                className: "w-full p-2 border rounded-md",
                placeholder: "例如：企業A團隊"
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: "block text-sm font-medium mb-1" }, "人數"),
              React.createElement('input', {
                type: "number",
                value: newGroup.size,
                onChange: (e) => setNewGroup({...newGroup, size: e.target.value}),
                className: "w-full p-2 border rounded-md",
                placeholder: "請輸入人數",
                min: "1"
              })
            ),
            React.createElement('div', { className: "flex space-x-3 pt-4" },
              React.createElement('button', {
                onClick: addGroup,
                className: "flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              }, "新增"),
              React.createElement('button', {
                onClick: () => setShowGroupModal(false),
                className: "flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              }, "取消")
            )
          )
        )
      )
    )
  );
};

export default SeatingDesigner;
