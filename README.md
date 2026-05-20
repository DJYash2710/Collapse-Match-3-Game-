# Color Blast

Color Blast is a browser-based matching game built with HTML, CSS, and JavaScript.

## What this does

The game shows a 10x10 grid of colored boxes. When you click a box, the code finds all adjacent boxes of the same color and removes the group if it contains more than two boxes.

After a successful match, the remaining boxes fall down to fill gaps and the columns shift horizontally to keep the board centered. Each match also plays a brick-breaking sound effect.

## New features included in this version

- Game mode selection dialog on page load:
  - `Standard` mode shows an elapsed time counter.
  - `Infinite` mode continuously spawns new boxes from the top and shows a running score.
- Six colors are now available: `red`, `yellow`, `blue`, `green`, `orange`, and `purple`.
- Score logic includes color-based values:
  - `blue` = 5 points
  - `red` = 10 points
  - `yellow` = 15 points
  - `green` = 20 points
  - `orange` = 25 points
  - `purple` = 30 points
- Animated gravity and shifting effects when boxes fall or columns recenter.
- Input is temporarily disabled while animations run to prevent invalid clicks.

## Project files

- `index.html`
  - Renders the game page and loads `style.css` and `game-logic.js`.
  - Displays a modal dialog for selecting `Standard` or `Infinite` mode.
- `style.css`
  - Styles the mode selection dialog and hover tooltips for each button.
  - Contains pointer-event rules used for disabling input during animations.
- `game-logic.js`
  - Builds the responsive grid and positions each box using window dimensions.
  - Uses recursive adjacency checking to select matching blocks.
  - Removes matching groups, applies gravity, and recenters columns.
  - Plays `assets/audio/brick_break.mp3` on each successful removal.
  - Implements infinite-mode spawning and mode-specific board text updates.

## How to play

1. Open `index.html` in a browser.
2. Choose `Standard` or `Infinite` mode in the dialog.
3. Click groups of same-colored boxes.
4. Only groups of three or more boxes are removed.
5. Watch the board update and the score/time display change.

## Notes

- The game currently uses absolute positioning to render boxes directly onto the page.
- Clicking a box starts a recursive match search across up/down/left/right neighbors.
- Matches are only removed when the connected group size is greater than two.

## Requirements

- A modern web browser that supports HTML5, CSS animations, and JavaScript.

## How to customize the board

- Change `row` and `col` values in `game-logic.js` to resize the grid.
- Update the `colors` array in `game-logic.js` to add, remove, or replace color choices.
- Adjust `playableWidthPercent`, `playableHeightPercent`, `startXPercent`, and `startYPercent` to reposition or resize the game area.
- Modify the point values in `updateScore()` to change scoring for each color.
- Replace `assets/audio/brick_break.mp3` with a different sound file for match feedback.

## Optional improvements

Future updates may include:
- better mobile layout and touch controls,
- a proper game-over condition,
- score display styling and reset functionality,
- additional sound effects and level progression.
