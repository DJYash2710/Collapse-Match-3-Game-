// const modal = document.getElementById("modeSelector");
// document.addEventListener("DOMContentLoaded", () => {
//   modal.showModal(); // Opens the dialog
// });
const standardModeBtn = document.getElementById("standard");
const infiniteModeBtn = document.getElementById("infinite");
standardModeBtn.addEventListener("click", () => {
  modal.close();
});
infiniteModeBtn.addEventListener("click", () => {
  modal.close();
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
if (boxWidth > boxHeight) {
  boxWidth = boxHeight;
  startGapX = playableWidth - boxWidth * row;
} else if (boxHeight > boxWidth) {
  boxHeight = boxWidth;
  startGapY = playableHeight - boxHeight * col;
}
createBox(startX, startY, playableWidth, playableHeight, "#000000", meta);
function getRandomInt() {
  min = 0;
  max = 3;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const colors = ["red", "yellow", "blue", "green"];
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

let set = new Set();
function clearSelectionOfBoxes() {
  set.clear();
}
let counter = 0;
function gravity() {
  for (let i = 0; i < row; i++) {
    for (let j = col - 1; j >= 0; j--) {
      if (document.getElementById("" + i + j) == null) {
        counter++;
      } else {
        let id = document.getElementById("" + i + j);
        disableInput();
        const animation = id.animate(
          [
            { top: id.style.top },
            { top: parseInt(id.style.top) + counter * boxHeight + "px" },
          ],
          {
            duration: 300,
            easing: "ease-in-out",
            fill: "both",
          },
        );
        id.style.top = parseInt(id.style.top) + counter * boxHeight + "px";
        id.id = "" + i + (j + counter);
        // id.textContent = "" + i + (j + counter);
        const newmeta = {
          x: i,
          y: j + counter,
          color: id.style.backgroundColor,
        };
        const capturedId = id; // ✅ capture before loop moves on
        animation.onfinish = () => {
          animation.cancel();
          capturedId.replaceWith(capturedId.cloneNode(true)); // ✅ strip old listeners after animation
          let fresh = document.getElementById("" + newmeta.x + newmeta.y);
          fresh.addEventListener("click", () => {
            clearSelectionOfBoxes();
            selectBoxes(newmeta.x, newmeta.y, newmeta.color);
            removeSelectedBoxes();
          });
          enableInput();
        };
      }
    }
    counter = 0;
  }
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
  let newStartLeft = gridLeft + (col * boxWidth - colsLeft.length * boxWidth) / 2;

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

      const newmeta = { x: newCol, y: j, color: id.style.backgroundColor };
      const capturedId = id; // ✅ capture before loop moves on
      animation.onfinish = () => {
        animation.cancel();
        capturedId.replaceWith(capturedId.cloneNode(true)); // ✅ strip old listeners after animation
        let fresh = document.getElementById("" + newmeta.x + newmeta.y);
        fresh.addEventListener("click", () => {
          clearSelectionOfBoxes();
          selectBoxes(newmeta.x, newmeta.y, newmeta.color);
          removeSelectedBoxes();
        });
        enableInput();
      };
    }
  }
}

function removeSelectedBoxes() {
  if (set.size > 1) {
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
function infiniteMode() {}