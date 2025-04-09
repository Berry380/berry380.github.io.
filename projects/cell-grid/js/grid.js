document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid');
    const clearBtn = document.getElementById('clear-btn');
    const randomBtn = document.getElementById('random-btn');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const expandBtn = document.getElementById('expand-btn');
    
    // Check if we're in compact mode (from URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const isCompact = urlParams.get('compact') !== 'false';
    
    const gridSize = isCompact ? 10 : 20;
    let grid = [];
    let intervalId = null;
    
    // Initialize grid
    function initializeGrid() {
        grid = [];
        gridContainer.innerHTML = '';
        
        // Set grid container class based on size
        if (isCompact) {
            gridContainer.classList.add('compact');
            gridContainer.classList.remove('full');
        } else {
            gridContainer.classList.add('full');
            gridContainer.classList.remove('compact');
        }
        
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                // Set cell class based on size
                if (isCompact) {
                    cell.classList.add('compact');
                    cell.classList.remove('full');
                } else {
                    cell.classList.add('full');
                    cell.classList.remove('compact');
                }
                
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', function() {
                    toggleCell(i, j);
                });
                
                gridContainer.appendChild(cell);
                grid[i][j] = false; // All cells start dead
            }
        }
    }
    
    // Toggle cell state
    function toggleCell(row, col) {
        grid[row][col] = !grid[row][col];
        updateCellDisplay(row, col);
    }
    
    // Update cell display
    function updateCellDisplay(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (grid[row][col]) {
            cell.classList.add('alive');
        } else {
            cell.classList.remove('alive');
        }
    }
    
    // Clear grid
    function clearGrid() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = false;
                updateCellDisplay(i, j);
            }
        }
    }
    
    // Randomize grid
    function randomizeGrid() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = Math.random() > 0.7; // 30% chance of being alive
                updateCellDisplay(i, j);
            }
        }
    }
    
    // Count live neighbors
    function countNeighbors(row, col) {
        let count = 0;
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Skip the cell itself
                
                const newRow = (row + i + gridSize) % gridSize;
                const newCol = (col + j + gridSize) % gridSize;
                
                if (grid[newRow][newCol]) count++;
            }
        }
        
        return count;
    }
    
    // Update grid based on Conway's Game of Life rules
    function updateGrid() {
        const newGrid = [];
        
        for (let i = 0; i < gridSize; i++) {
            newGrid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                const neighbors = countNeighbors(i, j);
                
                // Apply Conway's Game of Life rules
                if (grid[i][j]) {
                    // Live cell
                    newGrid[i][j] = neighbors === 2 || neighbors === 3;
                } else {
                    // Dead cell
                    newGrid[i][j] = neighbors === 3;
                }
            }
        }
        
        // Update grid and display
        grid = newGrid;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                updateCellDisplay(i, j);
            }
        }
    }
    
    // Start simulation
    function startSimulation() {
        if (intervalId) return;
        
        intervalId = setInterval(updateGrid, 200);
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
    
    // Stop simulation
    function stopSimulation() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
    
    // Toggle between compact and full view
    function toggleView() {
        const newUrl = isCompact ? 'grid.html?compact=false' : 'grid.html?compact=true';
        window.location.href = newUrl;
    }
    
    // Event listeners
    clearBtn.addEventListener('click', clearGrid);
    randomBtn.addEventListener('click', randomizeGrid);
    startBtn.addEventListener('click', startSimulation);
    stopBtn.addEventListener('click', stopSimulation);
    expandBtn.addEventListener('click', toggleView);
    
    // Update expand button text
    expandBtn.textContent = isCompact ? 'Expand to Full View' : 'Switch to Compact View';
    
    // Initialize the grid
    initializeGrid();
}); 