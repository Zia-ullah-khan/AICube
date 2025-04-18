document.addEventListener('DOMContentLoaded', function() {
    const cube = document.getElementById('cube');
    let rotateX = -25;
    let rotateY = -25;
    
    // Remove cube rotation buttons and create controls div with just Reset button
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';
    
    const resetButton = document.createElement('button');
    resetButton.id = 'reset';
    resetButton.textContent = 'Reset';
    
    const shuffleButton = document.createElement('button');
    shuffleButton.id = 'shuffle';
    shuffleButton.textContent = 'Shuffle';
    
    controlsDiv.appendChild(resetButton);
    controlsDiv.appendChild(shuffleButton);
    
    // Replace existing controls
    const existingControls = document.querySelector('.controls');
    if (existingControls) {
        existingControls.replaceWith(controlsDiv);
    } else {
        document.body.appendChild(controlsDiv);
    }
    
    // Reset button functionality
    document.getElementById('reset').addEventListener('click', function() {
        rotateX = -25;
        rotateY = -25;
        resetCube();
        updateCubeRotation();
    });
    
    // Add shuffle button functionality
    document.getElementById('shuffle').addEventListener('click', function() {
        shuffleCube();
    });
    
    // Create section for face rotations
    const faceRotationDiv = document.createElement('div');
    faceRotationDiv.className = 'slice-controls';
    faceRotationDiv.innerHTML = `
        <h3>Face Rotations</h3>
        <div>
            <button id="rotate-front-cw">Front CW</button>
            <button id="rotate-front-ccw">Front CCW</button>
        </div>
        <div>
            <button id="rotate-back-cw">Back CW</button>
            <button id="rotate-back-ccw">Back CCW</button>
        </div>
        <div>
            <button id="rotate-right-cw">Right CW</button>
            <button id="rotate-right-ccw">Right CCW</button>
        </div>
        <div>
            <button id="rotate-left-cw">Left CW</button>
            <button id="rotate-left-ccw">Left CCW</button>
        </div>
        <div>
            <button id="rotate-top-cw">Top CW</button>
            <button id="rotate-top-ccw">Top CCW</button>
        </div>
        <div>
            <button id="rotate-bottom-cw">Bottom CW</button>
            <button id="rotate-bottom-ccw">Bottom CCW</button>
        </div>
    `;
    controlsDiv.appendChild(faceRotationDiv);
    
    // Function to shuffle the cube
    function shuffleCube() {
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        const numberOfMoves = 20; // Number of random moves for shuffling
        let movesExecuted = 0;
        let isShuffling = true;
        
        // Disable buttons during shuffle
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
        
        function executeNextMove() {
            if (movesExecuted >= numberOfMoves || !isShuffling) {
                // Re-enable buttons after shuffle
                buttons.forEach(button => button.disabled = false);
                return;
            }
            
            // Pick random face and direction
            const randomFace = faces[Math.floor(Math.random() * faces.length)];
            const clockwise = Math.random() > 0.5;
            
            // Execute the rotation
            rotateFace(randomFace, clockwise);
            
            movesExecuted++;
            
            // Add a small delay between moves for visual effect
            setTimeout(executeNextMove, 300);
        }
        
        // Start the shuffling
        executeNextMove();
        
        // Add event handler to stop shuffling if needed
        document.addEventListener('keydown', function stopShuffleHandler(e) {
            if (e.key === 'Escape') {
                isShuffling = false;
                buttons.forEach(button => button.disabled = false);
                document.removeEventListener('keydown', stopShuffleHandler);
            }
        });
    }
    
    // Cube state representation - a 3D array (3x3x3) representing the cube
    // Each element is an object with 6 face colors
    // 0: front, 1: back, 2: right, 3: left, 4: top, 5: bottom
    const colors = {
        front: '#ff0000',   // Red
        back: '#FFA500',    // Orange
        right: '#00ff00',   // Green
        left: '#0000ff',    // Blue
        top: '#ffffff',     // White
        bottom: '#ffff00'   // Yellow
    };
    
    // Initialize cube state
    let cubeState = [];
    let initialCubeState = []; // Store initial state for reset

    function initCubeState() {
        cubeState = [];
        // Initialize the 3x3x3 cube with default colors
        for (let x = 0; x < 3; x++) {
            cubeState[x] = [];
            for (let y = 0; y < 3; y++) {
                cubeState[x][y] = [];
                for (let z = 0; z < 3; z++) {
                    cubeState[x][y][z] = {
                        // Default all faces to black (internal faces)
                        faces: ['black', 'black', 'black', 'black', 'black', 'black'],
                        position: [x, y, z]
                    };
                    
                    // Set the visible face colors
                    if (z === 0) cubeState[x][y][z].faces[0] = colors.front;  // Front face
                    if (z === 2) cubeState[x][y][z].faces[1] = colors.back;   // Back face
                    if (x === 2) cubeState[x][y][z].faces[2] = colors.right;  // Right face
                    if (x === 0) cubeState[x][y][z].faces[3] = colors.left;   // Left face
                    if (y === 0) cubeState[x][y][z].faces[4] = colors.top;    // Top face
                    if (y === 2) cubeState[x][y][z].faces[5] = colors.bottom; // Bottom face
                }
            }
        }
        
        // Store a deep copy of the initial state
        initialCubeState = JSON.parse(JSON.stringify(cubeState));
    }
    
    // Initialize cube state
    initCubeState();
    
    // Render the cube based on cubeState
    function renderCube() {
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        
        faces.forEach(face => {
            const faceElement = document.querySelector(`.cube__face--${face}`);
            const cubies = faceElement.querySelectorAll('.cubie');
            
            // Map the 3x3 grid to the right position in the cubeState
            for (let i = 0; i < 9; i++) {
                const x = i % 3;
                const y = Math.floor(i / 3);
                
                let faceIndex, cubieX, cubieY, cubieZ;
                
                switch (face) {
                    case 'front':
                        faceIndex = 0;
                        cubieX = x;
                        cubieY = y;
                        cubieZ = 0;
                        break;
                    case 'back':
                        faceIndex = 1;
                        cubieX = 2 - x;
                        cubieY = y;
                        cubieZ = 2;
                        break;
                    case 'right':
                        faceIndex = 2;
                        cubieX = 2;
                        cubieY = y;
                        cubieZ = x;
                        break;
                    case 'left':
                        faceIndex = 3;
                        cubieX = 0;
                        cubieY = y;
                        cubieZ = 2 - x;
                        break;
                    case 'top':
                        faceIndex = 4;
                        cubieX = x;
                        cubieY = 0;
                        cubieZ = 2 - y;
                        break;
                    case 'bottom':
                        faceIndex = 5;
                        cubieX = x;
                        cubieY = 2;
                        cubieZ = y;
                        break;
                }
                
                const color = cubeState[cubieX][cubieY][cubieZ].faces[faceIndex];
                cubies[i].style.backgroundColor = color;
            }
        });
    }
    
    // Reset cube to initial state
    function resetCube() {
        cubeState = JSON.parse(JSON.stringify(initialCubeState));
        renderCube();
    }

    // Functions to rotate slices of the cube
    function rotateFace(face, clockwise) {
        const newState = JSON.parse(JSON.stringify(cubeState)); // Deep copy
        
        // Helper function to rotate a 2D matrix
        function rotate2DMatrix(matrix, clockwise) {
            const n = matrix.length;
            const result = Array(n).fill().map(() => Array(n).fill(null));
            
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (clockwise) {
                        result[j][n-1-i] = matrix[i][j];
                    } else {
                        result[n-1-j][i] = matrix[i][j];
                    }
                }
            }
            return result;
        }
        
        // Helper function to validate face color before setting
        function validateFaceColor(color, faceIndex, position) {
            // If a face is about to be set to black but should have a color
            // (because it's on the outside of the cube), use the default color for that face
            if (color === 'black') {
                const [x, y, z] = position;
                if (faceIndex === 0 && z === 0) return colors.front;
                if (faceIndex === 1 && z === 2) return colors.back;
                if (faceIndex === 2 && x === 2) return colors.right;
                if (faceIndex === 3 && x === 0) return colors.left;
                if (faceIndex === 4 && y === 0) return colors.top;
                if (faceIndex === 5 && y === 2) return colors.bottom;
            }
            return color;
        }
        
        switch (face) {
            case 'front': // z = 0 plane
                {
                    // Get the current face state as a 2D array
                    const frontFace = [];
                    for (let y = 0; y < 3; y++) {
                        frontFace[y] = [];
                        for (let x = 0; x < 3; x++) {
                            frontFace[y][x] = cubeState[x][y][0];
                        }
                    }
                    
                    // Rotate the extracted face
                    const rotatedFace = rotate2DMatrix(frontFace, clockwise);
                    
                    // Update the cubies and rotate their face colors
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 3; x++) {
                            const originalCubie = rotatedFace[y][x];
                            const rotatedCubieFaces = [...originalCubie.faces];
                            
                            // Rotate colors: right -> bottom -> left -> top (clockwise)
                            if (clockwise) {
                                [rotatedCubieFaces[2], rotatedCubieFaces[5], rotatedCubieFaces[3], rotatedCubieFaces[4]] = 
                                [rotatedCubieFaces[4], rotatedCubieFaces[2], rotatedCubieFaces[5], rotatedCubieFaces[3]];
                            } else {
                                [rotatedCubieFaces[2], rotatedCubieFaces[5], rotatedCubieFaces[3], rotatedCubieFaces[4]] = 
                                [rotatedCubieFaces[5], rotatedCubieFaces[3], rotatedCubieFaces[4], rotatedCubieFaces[2]];
                            }
                            
                            // Validate face colors
                            for (let i = 0; i < 6; i++) {
                                rotatedCubieFaces[i] = validateFaceColor(
                                    rotatedCubieFaces[i], 
                                    i, 
                                    [x, y, 0]
                                );
                            }
                            
                            newState[x][y][0].faces = rotatedCubieFaces;
                        }
                    }
                }
                break;
                
            case 'back': // z = 2 plane
                {
                    // Get the current face state as a 2D array
                    const backFace = [];
                    for (let y = 0; y < 3; y++) {
                        backFace[y] = [];
                        for (let x = 0; x < 3; x++) {
                            // For back face, x is reversed
                            backFace[y][x] = cubeState[2-x][y][2];
                        }
                    }
                    
                    // Rotate the extracted face
                    const rotatedFace = rotate2DMatrix(backFace, clockwise);
                    
                    // Update the cubies and rotate their face colors
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 3; x++) {
                            const originalCubie = rotatedFace[y][x];
                            const rotatedCubieFaces = [...originalCubie.faces];
                            
                            // Rotate colors: right -> top -> left -> bottom (clockwise)
                            if (clockwise) {
                                [rotatedCubieFaces[2], rotatedCubieFaces[4], rotatedCubieFaces[3], rotatedCubieFaces[5]] = 
                                [rotatedCubieFaces[5], rotatedCubieFaces[2], rotatedCubieFaces[4], rotatedCubieFaces[3]];
                            } else {
                                [rotatedCubieFaces[2], rotatedCubieFaces[4], rotatedCubieFaces[3], rotatedCubieFaces[5]] = 
                                [rotatedCubieFaces[4], rotatedCubieFaces[3], rotatedCubieFaces[5], rotatedCubieFaces[2]];
                            }
                            
                            // Validate face colors
                            for (let i = 0; i < 6; i++) {
                                rotatedCubieFaces[i] = validateFaceColor(
                                    rotatedCubieFaces[i], 
                                    i, 
                                    [2-x, y, 2]
                                );
                            }
                            
                            newState[2-x][y][2].faces = rotatedCubieFaces;
                        }
                    }
                }
                break;
                
            case 'right': // x = 2 plane
                {
                    // Get the current face state as a 2D array
                    const rightFace = [];
                    for (let y = 0; y < 3; y++) {
                        rightFace[y] = [];
                        for (let z = 0; z < 3; z++) {
                            // For right face, z is reversed
                            rightFace[y][z] = cubeState[2][y][z];
                        }
                    }
                    
                    // Rotate the extracted face
                    const rotatedFace = rotate2DMatrix(rightFace, clockwise);
                    
                    // Update the cubies and rotate their face colors
                    for (let y = 0; y < 3; y++) {
                        for (let z = 0; z < 3; z++) {
                            const originalCubie = rotatedFace[y][z];
                            const rotatedCubieFaces = [...originalCubie.faces];
                            
                            // Rotate colors: front -> top -> back -> bottom (clockwise)
                            if (clockwise) {
                                [rotatedCubieFaces[0], rotatedCubieFaces[4], rotatedCubieFaces[1], rotatedCubieFaces[5]] = 
                                [rotatedCubieFaces[5], rotatedCubieFaces[0], rotatedCubieFaces[4], rotatedCubieFaces[1]];
                            } else {
                                [rotatedCubieFaces[0], rotatedCubieFaces[4], rotatedCubieFaces[1], rotatedCubieFaces[5]] = 
                                [rotatedCubieFaces[4], rotatedCubieFaces[1], rotatedCubieFaces[5], rotatedCubieFaces[0]];
                            }
                            
                            // Validate face colors
                            for (let i = 0; i < 6; i++) {
                                rotatedCubieFaces[i] = validateFaceColor(
                                    rotatedCubieFaces[i], 
                                    i, 
                                    [2, y, z]
                                );
                            }
                            
                            newState[2][y][z].faces = rotatedCubieFaces;
                        }
                    }
                }
                break;
                
            case 'left': // x = 0 plane
                {
                    // Get the current face state as a 2D array
                    const leftFace = [];
                    for (let y = 0; y < 3; y++) {
                        leftFace[y] = [];
                        for (let z = 0; z < 3; z++) {
                            // For left face, z is reversed
                            leftFace[y][z] = cubeState[0][y][2-z];
                        }
                    }
                    
                    // Rotate the extracted face
                    const rotatedFace = rotate2DMatrix(leftFace, clockwise);
                    
                    // Update the cubies and rotate their face colors
                    for (let y = 0; y < 3; y++) {
                        for (let z = 0; z < 3; z++) {
                            const originalCubie = rotatedFace[y][z];
                            const rotatedCubieFaces = [...originalCubie.faces];
                            
                            // Rotate colors: front -> bottom -> back -> top (clockwise)
                            if (clockwise) {
                                [rotatedCubieFaces[0], rotatedCubieFaces[5], rotatedCubieFaces[1], rotatedCubieFaces[4]] = 
                                [rotatedCubieFaces[4], rotatedCubieFaces[0], rotatedCubieFaces[5], rotatedCubieFaces[1]];
                            } else {
                                [rotatedCubieFaces[0], rotatedCubieFaces[5], rotatedCubieFaces[1], rotatedCubieFaces[4]] = 
                                [rotatedCubieFaces[5], rotatedCubieFaces[1], rotatedCubieFaces[4], rotatedCubieFaces[0]];
                            }
                            
                            // Validate face colors
                            for (let i = 0; i < 6; i++) {
                                rotatedCubieFaces[i] = validateFaceColor(
                                    rotatedCubieFaces[i], 
                                    i, 
                                    [0, y, 2-z]
                                );
                            }
                            
                            newState[0][y][2-z].faces = rotatedCubieFaces;
                        }
                    }
                }
                break;
                
            case 'top': // y = 0 plane
                {
                    // Get the current face state as a 2D array
                    const topFace = [];
                    for (let z = 0; z < 3; z++) {
                        topFace[z] = [];
                        for (let x = 0; x < 3; x++) {
                            // For top face, z is reversed
                            topFace[z][x] = cubeState[x][0][2-z];
                        }
                    }
                    
                    // Rotate the extracted face
                    const rotatedFace = rotate2DMatrix(topFace, clockwise);
                    
                    // Update the cubies and rotate their face colors
                    for (let z = 0; z < 3; z++) {
                        for (let x = 0; x < 3; x++) {
                            const originalCubie = rotatedFace[z][x];
                            const rotatedCubieFaces = [...originalCubie.faces];
                            
                            // Rotate colors: front -> right -> back -> left (clockwise)
                            if (clockwise) {
                                [rotatedCubieFaces[0], rotatedCubieFaces[2], rotatedCubieFaces[1], rotatedCubieFaces[3]] = 
                                [rotatedCubieFaces[3], rotatedCubieFaces[0], rotatedCubieFaces[2], rotatedCubieFaces[1]];
                            } else {
                                [rotatedCubieFaces[0], rotatedCubieFaces[2], rotatedCubieFaces[1], rotatedCubieFaces[3]] = 
                                [rotatedCubieFaces[2], rotatedCubieFaces[1], rotatedCubieFaces[3], rotatedCubieFaces[0]];
                            }
                            
                            // Validate face colors
                            for (let i = 0; i < 6; i++) {
                                rotatedCubieFaces[i] = validateFaceColor(
                                    rotatedCubieFaces[i], 
                                    i, 
                                    [x, 0, 2-z]
                                );
                            }
                            
                            newState[x][0][2-z].faces = rotatedCubieFaces;
                        }
                    }
                }
                break;
                
            case 'bottom': // y = 2 plane
                {
                    // Get the current face state as a 2D array
                    const bottomFace = [];
                    for (let z = 0; z < 3; z++) {
                        bottomFace[z] = [];
                        for (let x = 0; x < 3; x++) {
                            // For bottom face, z is straight
                            bottomFace[z][x] = cubeState[x][2][z];
                        }
                    }
                    
                    // Rotate the extracted face
                    const rotatedFace = rotate2DMatrix(bottomFace, clockwise);
                    
                    // Update the cubies and rotate their face colors
                    for (let z = 0; z < 3; z++) {
    let previousX, previousY;
    
    cube.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousX = e.clientX;
        previousY = e.clientY;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const dx = e.clientX - previousX;
            const dy = e.clientY - previousY;
            
            rotateY += dx * 0.5;
            rotateX += dy * 0.5;
            
            updateCubeRotation();
            
            previousX = e.clientX;
            previousY = e.clientY;
        }
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // Touch support for mobile
    cube.addEventListener('touchstart', function(e) {
        isDragging = true;
        previousX = e.touches[0].clientX;
        previousY = e.touches[0].clientY;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if (isDragging && e.touches.length > 0) {
            const dx = e.touches[0].clientX - previousX;
            const dy = e.touches[0].clientY - previousY;
            
            rotateY += dx * 0.5;
            rotateX += dy * 0.5;
            
            updateCubeRotation();
            
            previousX = e.touches[0].clientX;
            previousY = e.touches[0].clientY;
        }
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    function updateCubeRotation() {
        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Initialize the cube rendering
    renderCube();
});
