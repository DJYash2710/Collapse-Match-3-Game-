# Color Blast

This project is a simple browser-based grid game built with HTML, CSS, and JavaScript.

## What this does

The app creates a grid of colored boxes on the page. When you click any box, the code collects all connected boxes of the same color and removes them if there are at least two in the matched group.

After boxes are removed, the remaining boxes fall down to fill empty spaces, and the whole grid recenters horizontally. A sound effect plays when a match is removed.

## What is in the code

- `index.html`
  - Loads the page and includes `style.css` and `Script.js`.
  - Contains a `div` placeholder and loads the JavaScript logic.

- `style.css`
  - Defines the simple pointer behavior class used to disable input temporarily.

- `Script.js`
  - Builds the board as a 10x10 grid of colored boxes.
  - Computes dimensions based on the browser window size so the grid fits the screen.
  - Creates each colored box as a positioned `div` element.
  - Listens for clicks and finds matching neighbors using recursive adjacency checks.
  - Removes selected groups and applies gravity so boxes fall into empty columns.
  - Re-centers the remaining boxes horizontally after removals.
  - Plays a brick-breaking audio effect from `assets/audio/brick_break.mp3`.

## How to run

1. Open `index.html` in a web browser.
2. Click on groups of adjacent boxes with the same color.
3. Watch the matched boxes disappear and the remaining boxes fall and recenter.

## Notes

- The grid uses four colors: red, yellow, blue, and green.
- Only groups with more than one connected box are removed.
- The game runs entirely in the browser with no backend.

## Future updates

This README will be updated as more features are added, such as score tracking, level progression, animations, or mobile controls.
