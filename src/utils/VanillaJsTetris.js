function getTetrominos() {
    const tetromino = new Array;
    tetromino.push("..x...x...x...x.")
    tetromino.push("..x..xx..x......")
    tetromino.push(".x...xx...x.....")
    tetromino.push(".....xx..xx.....")
    tetromino.push("..x..xx...x.....")
    tetromino.push(".....xx..x...x..")
    tetromino.push(".....xx...x...x.")

    return tetromino;
}

function keyDownHandler(event) {
    if (event.keyCode == 39 && this.rightPressed == 0) { this.rightPressed = 1; }
    if (event.keyCode == 37 && this.leftPressed == 0) { this.leftPressed = 1; }
    if (event.keyCode == 40 && this.downPressed == 0) { this.downPressed = 1; }
    if (event.keyCode == 90 && this.zPressed == 0) { this.zPressed = 1; }
}

function keyUpHandler(event) {
    if (event.keyCode == 39) { this.rightPressed = 0; }
    if (event.keyCode == 37) { this.leftPressed = 0; }
    if (event.keyCode == 40) { this.downPressed = 0; }
    if (event.keyCode == 90) { this.zPressed = 0; }
}

function generateGrid() {
    this.grid = [];
    this.score = 0;
    // Add squares to grid
    for (let i = 0; i < this.rows; i++) {
        let temp = new Array;
        for (let j = 0; j < this.columns; j++) {
            temp.push("_");
        }
        this.grid.push(temp);
    }

    for (let i = 0; i < this.rows; i++) {
        this.grid[i][0] = "b";
        this.grid[i][this.columns - 1] = "b";
    }
    for (let i = 0; i < this.columns; i++) {
        this.grid[this.rows - 1][i] = "b";
    }

    this.nTetromino = Math.floor(Math.random() * 7);
    this.nextTetromino = Math.floor(Math.random() * 7);
    this.countTetromino = 1;

    this.xPosition = this.columns / 2 - 1
    this.yPosition = 0
}

function deepCopyGrid(array) {
    let temp = new Array;
    for (let i = 0; i < array.length; i++) {
        temp.push(array[i].slice(0));
    }
    return temp;
}

function checkMovement(xPos, yPos, nTetromino, nRotation) {
    let tetro = this.tetromino[nTetromino];
    let tempCheck;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (yPos + j >= 0) {
                tempCheck = this.grid[yPos + j];
            } else {
                tempCheck = ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'];
            }

            if (tetro.charAt(mapCoordToIndex(i, j, nRotation)) == "x" && tempCheck[xPos + i] != "_") {
                return false;
            }
        }
    }
    return true;
}

function consolidatePiece() {
    paintTetromino.bind(this)(this.xPosition, this.yPosition, this.nTetromino, this.nRotation);
    this.grid = deepCopyGrid(this.gridRender);

    let tempCon = checkTetris.bind(this)();

    this.xPosition = this.columns / 2 - 1;
    this.yPosition = 0;
    this.nRotation = 0;

    this.nTetromino = this.nextTetromino;
    this.nextTetromino = Math.floor(Math.random() * 7);
    this.countTetromino += 1;

    return tempCon;
}

function mapCoordToIndex(xRelative, yRelative, nRotation) {
    if (nRotation % 4 == 0) { return yRelative * 4 + xRelative; }
    if (nRotation % 4 == 1) { return 12 + yRelative - (4 * xRelative); }
    if (nRotation % 4 == 2) { return 15 - (yRelative * 4) - xRelative; }
    if (nRotation % 4 == 3) { return 3 - yRelative + (4 * xRelative); }
    return 0;
}

function paintTetris() {
    if (this.countDown % 6 == 1 || this.countDown % 6 == 2 || this.countDown % 6 == 3) {
        let temp = ['b'];
        for (let i = 0; i < this.columns - 2; i++) { temp.push('t'); }
        temp.push('b');

        for (let i = 0; i < this.bQueuedTetris.length; i++) {
            this.gridRender[this.bQueuedTetris[i]] = temp;
        }
    }
}

function paintTetromino(xPos, yPos, nTetromino, nRotation) {
    let tetro = this.tetromino[nTetromino];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (tetro.charAt(mapCoordToIndex(i, j, nRotation)) == "x") {
                this.gridRender[yPos + j][xPos + i] = "asdfghj"[nTetromino];
            }
        }
    }
}

function checkTetris() {
    let temp = new Array;
    for (let j = 1; j < this.rows - 1; j++) {
        let bFull = true;
        for (let i = 0; i < this.columns; i++) {
            if (this.grid[j][i] == "_") { bFull = false; }
        }
        if (bFull) { temp.push(j); }
    }
    return temp;
}

function mainGameLoop() {
    if (this.state === 'running') {
        // Timing
        this.ticks++;
        this.gridRender = deepCopyGrid(this.grid);

        // Input
        if (this.rightPressed) {
            if (this.rightPressed == 1 && checkMovement.bind(this)(this.xPosition + 1, this.yPosition, this.nTetromino, this.nRotation)) { this.xPosition += 1; }
            this.rightPressed = (this.rightPressed) % 3 + 1;
        } else if (this.leftPressed) {
            if (this.leftPressed == 1 && checkMovement.bind(this)(this.xPosition - 1, this.yPosition, this.nTetromino, this.nRotation)) { this.xPosition -= 1; }
            this.leftPressed = (this.leftPressed) % 3 + 1;
        }

        if (this.downPressed) {
            if (this.downPressed == 1) {
                if (checkMovement.bind(this)(this.xPosition, this.yPosition + 1, this.nTetromino, this.nRotation)) { this.yPosition += 1; } else { this.bQueuedTetris = consolidatePiece.bind(this)(); }
            }
            this.downPressed = (this.downPressed) % 2 + 1;
        }

        if (this.zPressed) {
            if (this.zPressed == 1 && checkMovement.bind(this)(this.xPosition, this.yPosition, this.nTetromino, this.nRotation + 1)) { this.nRotation += 1; }
            this.zPressed = 2;
        }

        // Game Logic
        let vel = 20 - Math.floor(this.countTetromino / 10);
        if (this.ticks % vel == 0) {
            if (checkMovement.bind(this)(this.xPosition, this.yPosition + 1, this.nTetromino, this.nRotation)) {
                this.yPosition += 1;
            } else {
                this.bQueuedTetris = consolidatePiece.bind(this)(); // Returns the line that will be eliminated (but first, animated)
            }
        }

        if (this.countDown) { // Countdown creates a animation process when a tetris is made
            this.countDown--;
            if (this.countDown == 0) {
                for (let i = 0; i < this.bQueuedTetris.length; i++) {
                    for (let temp = 0; temp < (this.bQueuedTetris[i]); temp++) {
                        this.grid[this.bQueuedTetris[i] - temp] = this.grid[this.bQueuedTetris[i] - (temp + 1)].slice(0);
                    }
                }
                this.score += (50 * this.bQueuedTetris.length) + (6) ** this.bQueuedTetris.length;
                this.bQueuedTetris = new Array;
            }
        }
        if (this.bQueuedTetris[0] && !this.countDown) { this.countDown = 10; }

        if (!checkMovement.bind(this)(this.xPosition, this.yPosition, this.nTetromino, this.nRotation)) {
            this.state = 'game over';
        }

        // Render Output
        if (this.countDown) { paintTetris.bind(this)(); }

        paintTetromino.bind(this)(this.xPosition, this.yPosition, this.nTetromino, this.nRotation);
    }
}

function restartGame() {
    generateGrid.bind(this)();
    this.state = 'running';
}

export { getTetrominos, keyDownHandler, keyUpHandler, generateGrid, mainGameLoop, restartGame }