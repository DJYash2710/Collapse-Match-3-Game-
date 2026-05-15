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
console.log("Total width " + totalWidth);
console.log("Total height " + totalHeight);
console.log("Playable width " + playableWidth);
console.log("playable height " + playableHeight);
console.log("gap from left " + startX);
console.log("gap from top " + startY);
console.log("box width " + boxWidth);
console.log("box height " + boxHeight);
let meta = {};
let startGapX = 0;
let startGapY = 0;
if (boxWidth > boxHeight) {
  boxWidth = boxHeight;
  startGapX = playableWidth - boxWidth * row;
  console.log("width left" + startGapX);
} else if (boxHeight > boxWidth) {
  boxHeight = boxWidth;
  startGapY = playableHeight - boxHeight * col;
  console.log("height left" + startGapY);
}
console.log("box width " + boxWidth);
console.log("box height " + boxHeight);
createbox(startX, startY, playableWidth, playableHeight, "#000000", meta);
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
    createbox(posX, posY, boxWidth, boxHeight, color, meta, boxId);
  }
}
function createbox(x, y, width, height, color, meta, boxId) {
  const box = document.createElement("div");
  box.id = boxId;
  box.style.width = width + "px";
  box.style.height = height + "px";
  box.style.backgroundColor = color;
  box.style.border = "2px solid black";
  box.style.position = "absolute";
  box.style.left = x + "px";
  box.style.top = y + "px";
  box.textContent = "" + meta.x + meta.y;
  box.addEventListener("click", () => {
    pop();
    onClickRemoveElement(meta.x, meta.y, meta.color);
    if (set.size > 1) {
      set.forEach((boxId) => {
        let el = document.getElementById(boxId);
        el.remove();
      });
      moveDown();
      moveCenter();
    }
  });
  document.body.appendChild(box);
}
function onClickRemoveElement(x, y, color) {
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
    onClickRemoveElement(rightSide, y, color);
  }
  const leftSide = x - 1;
  if (leftSide >= 0) {
    onClickRemoveElement(leftSide, y, color);
  }
  const bottomSide = y + 1;
  if (bottomSide < row) {
    onClickRemoveElement(x, bottomSide, color);
  }
  const topSide = y - 1;
  if (topSide >= 0) {
    onClickRemoveElement(x, topSide, color);
  }
}

let set = new Set();
function pop() {
  set.clear();
}
let counter = 0;
function moveDown() {
  for (let i = 0; i < row; i++) {
    for (let j = col - 1; j >= 0; j--) {
      if (document.getElementById("" + i + j) == null) {
        counter++;
      } else {
        let id = document.getElementById("" + i + j);
        overLay();
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
        animation.onfinish = () => {
          animation.cancel();
          removeOverlay();
        };
        id.id = "" + i + (j + counter);
        id.textContent = "" + i + (j + counter);
        const newmeta = {
          x: i,
          y: j + counter,
          color: id.style.backgroundColor,
        };
        id.addEventListener("click", () => {
          pop();
          onClickRemoveElement(newmeta.x, newmeta.y, newmeta.color);
          if (set.size > 1) {
            set.forEach((boxId) => {
              let el = document.getElementById(boxId);
              el.remove();
            });
            moveDown();
            moveCenter();
          }
        });
      }
    }
    counter = 0;
  }
}

function overLay() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let id = document.getElementById("" + i + j);
      if (id) {
        id.style.pointerEvents = "none";
      }
    }
  }
}
function removeOverlay() {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let id = document.getElementById("" + i + j);
      if (id) {
        id.style.pointerEvents = "auto";
      }
    }
  }
}

function moveCenter() {
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

      overLay();
      const animation = id.animate(
        [
          { left: id.style.left },
          { left: newLeft + "px" },
        ],
        { duration: 300, easing: "ease-in-out", fill: "both" }
      );
      id.style.left = newLeft + "px";
      animation.onfinish = () => { animation.cancel(); removeOverlay(); };

      id.id = "" + newCol + j;
      id.textContent = "" + newCol + j;

      const newmeta = { x: newCol, y: j, color: id.style.backgroundColor };
      id.addEventListener("click", () => {
        pop();
        onClickRemoveElement(newmeta.x, newmeta.y, newmeta.color);
        if (set.size > 2) {
          set.forEach((boxId) => {
            document.getElementById(boxId)?.remove();
          });
          moveDown();
          moveCenter();
        }
      });
    }
  }
}