const modal = document.getElementById("modeSelector");
document.addEventListener("DOMContentLoaded", () => {
  modal.showModal(); // Opens modal
});
const standardModeBtn = document.getElementById("standard");
const infiniteModeBtn = document.getElementById("infinite");
standardModeBtn.addEventListener("click", () => {
  modal.close(); //close modal
  standardModeScore();
  standardModeRule();
});
infiniteModeBtn.addEventListener("click", () => {
  modal.close(); //close modal
  infiniteModeScore();
  setInterval(() => {
    infiniteMode();
  }, 300);
});
let row = 10;
let col = 10;
let totalWidth = window.innerWidth;
let totalHeight = window.innerHeight;
let playableWidthPercent = 60 / 100;
let playableHeightPercent = 91 / 100;
let startXPercent = 2 / 100;
let startYPercent = 7 / 100;
let playableWidth = totalWidth * playableWidthPercent;
let playableHeight = totalHeight * playableHeightPercent;
let boxWidth = playableWidth / col;
let boxHeight = playableHeight / row;
let startX = totalWidth * startXPercent;
let startY = totalHeight * startYPercent;
let center = row % 2 == 0 ? row / 2 : (row + 1) / 2;
let meta = {};
let startGapX = 0;
let startGapY = 0;
let set = new Set();
let mainScore = 0;
if (boxWidth > boxHeight) {
  boxWidth = boxHeight;
  startGapX = playableWidth - boxWidth * row;
} else if (boxHeight > boxWidth) {
  boxHeight = boxWidth;
  startGapY = playableHeight - boxHeight * col;
}
createBox(startX, startY, playableWidth, playableHeight, "#000000", meta);
function getRandomInt() {
  let min = 0;
  let max = 5;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const colors = ["red", "yellow", "blue", "green","orange","purple"];
for (let i = 0; i < row; i++) {
  for (let j = 0; j < col; j++) {
    let posX = startX + startGapX / 2 + j * boxWidth;
    let posY = startY + startGapY / 2 + i * boxHeight;
    color = colors[getRandomInt()];
    let boxId = "" + j + i;
    meta = {
      x: j,
      y: i,
      color: color,
    };
    createBox(posX, posY, boxWidth, boxHeight, color, meta, boxId);
  }
}
function createBox(x, y, width, height, color, meta, boxId) {
  const box = document.createElement("div");
  box.id = boxId;
  box.style.width = width + "px";
  box.style.height = height + "px";
  box.style.backgroundColor = color;
  box.style.border = "2px solid black";
  box.style.position = "absolute";
  box.style.left = x + "px";
  box.style.top = y + "px";
  // box.textContent = "" + meta.x + meta.y;
  box.addEventListener("click", () => {
    clearSelectionOfBoxes();
    selectBoxes(meta.x, meta.y, meta.color);
    updateScore(meta.color);
    removeSelectedBoxes();
  });
  document.body.appendChild(box);
  return box;
}
function selectBoxes(x, y, color) {
  let boxId = "" + x + y;
  let id = document.getElementById(boxId);
  if (!id) return;
  let check_color = id.style.backgroundColor;
  if (check_color != color || id.style.display == "none" || set.has(boxId)) {
    return;
  }
  set.add(boxId);
  const rightSide = x + 1;
  if (rightSide < col) {
    selectBoxes(rightSide, y, color);
  }
  const leftSide = x - 1;
  if (leftSide >= 0) {
    selectBoxes(leftSide, y, color);
  }
  const bottomSide = y + 1;
  if (bottomSide < row) {
    selectBoxes(x, bottomSide, color);
  }
  const topSide = y - 1;
  if (topSide >= 0) {
    selectBoxes(x, topSide, color);
  }
}
function clearSelectionOfBoxes() {
  set.clear();
}
let counter = 0;
function gravity() {
  let promises = [];
  for (let i = 0; i < col; i++) {
    let counter = 0;
    for (let j = row - 1; j >= 0; j--) {
      let id = document.getElementById("" + i + j);
      if (id == null) {
        counter++;
      } else {
        if (counter === 0) continue;
        const fromTop = parseInt(id.style.top);
        const toTop = fromTop + counter * boxHeight;
        const newMeta = {
          x: i,
          y: j + counter,
          color: id.style.backgroundColor,
        };
        id.id = "" + newMeta.x + newMeta.y;
        id.style.top = toTop + "px";
        disableInput();
        const capturedId = id;
        const promise = new Promise((resolve) => {
          const animation = capturedId.animate(
            [{ top: fromTop + "px" }, { top: toTop + "px" }],
            { duration: 300, easing: "ease-in", fill: "both" },
          );
          animation.onfinish = () => {
            animation.cancel();
            capturedId.replaceWith(capturedId.cloneNode(true));
            let fresh = document.getElementById("" + newMeta.x + newMeta.y);
            fresh.addEventListener("click", () => {
              clearSelectionOfBoxes();
              selectBoxes(newMeta.x, newMeta.y, newMeta.color);
              updateScore(newMeta.color);
              removeSelectedBoxes();
            });
            resolve();
          };
        });
        promises.push(promise);
      }
    }
  }
  Promise.all(promises).then(() => {
    //Only re-enable input after ALL boxes finish animating
    enableInput();
  });
}
function disableInput() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let id = document.getElementById("" + i + j);
      if (id) {
        id.style.pointerEvents = "none";
      }
    }
  }
}
function enableInput() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let id = document.getElementById("" + i + j);
      if (id) {
        id.style.pointerEvents = "auto";
      }
    }
  }
}
function centerAlign() {
  let colsLeft = [];
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      if (document.getElementById("" + i + j) != null) {
        colsLeft.push(i);
        break;
      }
    }
  }
  if (colsLeft.length == 0) return;
  if (colsLeft.length == col) return;
  let gridLeft = startX + startGapX / 2;
  let newStartLeft =
    gridLeft + (col * boxWidth - colsLeft.length * boxWidth) / 2;
  for (let k = 0; k < colsLeft.length; k++) {
    let oldCol = colsLeft[k];
    let newCol = k;
    let newLeft = newStartLeft + k * boxWidth;
    for (let j = 0; j < row; j++) {
      let id = document.getElementById("" + oldCol + j);
      if (id == null) continue;
      disableInput();
      const animation = id.animate(
        [{ left: id.style.left }, { left: newLeft + "px" }],
        { duration: 300, easing: "ease-in-out", fill: "both" },
      );
      id.style.left = newLeft + "px";
      id.id = "" + newCol + j;
      // id.textContent = "" + newCol + j;
      const newMeta = { x: newCol, y: j, color: id.style.backgroundColor };
      const capturedId = id;
      animation.onfinish = () => {
        animation.cancel();
        capturedId.replaceWith(capturedId.cloneNode(true));
        let fresh = document.getElementById("" + newMeta.x + newMeta.y);
        fresh.addEventListener("click", () => {
          clearSelectionOfBoxes();
          selectBoxes(newMeta.x, newMeta.y, newMeta.color);
          updateScore(newMeta.color);
          removeSelectedBoxes();
        });
        enableInput();
      };
    }
  }
}
function updateScore(color) {
  const colorValues = {
    blue: 5,
    red: 10,
    yellow: 15,
    green: 20,
    orange: 25,
    purple: 30,
  };
  if (set.size > 2) mainScore += set.size * colorValues[color];
}
function removeSelectedBoxes() {
  if (set.size > 2) {
    set.forEach((boxId) => {
      document.getElementById(boxId)?.remove();
    });
    gravity();
    centerAlign();
    brickBlastSound();
  }
}
const sound = new Audio("assets/audio/brick_break.mp3");
function brickBlastSound() {
  sound.currentTime = 0;
  sound.play();
}
function infiniteMode() {
  for (let i = 0; i < row; i++) {
    let id = document.getElementById("" + i + "0");
    if (id == null) {
      let posX = startX + startGapX / 2 + i * boxWidth;
      let posY = startY + startGapY / 2 - boxHeight;
      let color = colors[getRandomInt()];
      let boxId = "" + i + 0;
      const newMeta = {
        x: i,
        y: 0,
        color: color,
      };
      const box = createBox(
        posX,
        posY,
        boxWidth,
        boxHeight,
        color,
        newMeta,
        boxId,
      );
      disableInput();
      const animation = box.animate(
        [
          { top: box.style.top, opacity: 0 },
          { top: posY + boxHeight + "px", opacity: 1 },
        ],
        {
          duration: 300,
          easing: "ease-in-out",
          fill: "both",
        },
      );
      box.style.top = posY + boxHeight + "px";
      gravity();
    }
  }
}
const board = document.createElement("div");
board.style.position = "absolute";
board.style.left = playableWidth + "px";
board.style.transform = "translateX(+50%)";
board.style.top = startY + "px";
board.style.fontSize = "25px";
board.id = "board";
board.style.fontWeight = "bold";
function infiniteModeScore() {
  setInterval(() => {
    board.textContent = "Score-" + mainScore;
  }, 300);
  document.body.appendChild(board);
}
function standardModeScore() {
  let startTime = Date.now();
  setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    // Formatting with leading zeros
    let display = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    board.textContent = "Time -" + display;
  }, 1000);
  document.body.appendChild(board);
}
function standardModeRule(){
  
}