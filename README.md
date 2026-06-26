# 2026 World Cup Bracket & Knockout Predictor

An interactive Single Page Application (SPA) designed to predict and visualize the knockout stage of the 2026 FIFA World Cup. Users can dynamically slot teams into the bracket, advance them through the tournament rounds (Round of 32 to the World Final), and export their completed bracket predictions as a high-quality image.

## Key Features

- **Dynamic Bracket Progression**: Automatically advances selected winners to the next rounds.
- **Cascade Resolution**: If a team is removed or changed in an earlier round, any dependent matches later in the bracket are automatically cleared to prevent invalid states.
- **Interactive Team Management**: Side drawer lists unseeded qualified teams and final group stage matches to let users drag/tap pending teams into the bracket.
- **Export/Share Functionality**: Renders the complete tournament tree structure into a high-fidelity PNG image using `html2canvas` for easy sharing.
- **Responsive Layout**: Adapts smoothly to mobile, tablet, and desktop screens with custom touch-gesture support.

## Tech Stack

The application is built as a modular static site using the following client-side technologies:
- **React (v18.3.1)**: Underpins the application logic, custom component tree, and dynamic state updates.
- **Babel Standalone (v7.24.0)**: Compiles JSX in real-time within the browser.
- **Tailwind CSS (v3.4.1)**: Utility-first CSS styling framework with a custom configurations (custom colors, fonts, glow gradients, and grid patterns).
- **html2canvas (v1.4.1)**: Client-side screenshot generator used to package the user's prediction into an image.
- **Custom CSS (`docs/style.css`)**: Custom webkit scrollbars, glassmorphism panels, and keyframe-based pulse animation structures.

## File Structure

The project has been refactored from a monolithic setup into clean, maintainable, single-responsibility files inside the `docs/` directory:
- `docs/index.html`: The main lightweight HTML shell loading the Tailwind/React environment and referencing the assets.
- `docs/style.css`: Extracted CSS styles containing custom animations, layout rules, and media-query styling.
- `docs/constants.js`: Holds all data sources including initial fixed seeds, unseeded teams, and group fixtures, bound to the global `window` object.
- `docs/app.js`: Contains the React component hierarchy (e.g. `App`, `TeamButton`) and state synchronization logic.

## Running Locally

To view and run the application locally, you can serve the `docs/` directory using any static file server:

### Using Python 3
```bash
python3 -m http.server --directory docs 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Using Node.js (npx)
```bash
npx serve docs
```
Then navigate to the URL printed in your terminal (typically `http://localhost:3000` or `http://localhost:5000`).

## Deployment

This application is configured for automatic deployment using **GitHub Pages** from the `docs/` directory. Any updates pushed to the main branch will be reflected live on the public URL.
