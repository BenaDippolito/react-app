# Final Project — React Scaffold

This folder contains a minimal React + Vite scaffold to help convert the original HTML/CSS/JS project into React components.

What I created

- `package.json` — scripts to run Vite dev server.
- `index.html` — Vite entry.
- `src/main.jsx` — React entry (imports original `styles.css` from project root).
- `src/App.jsx` — Router and navigation.
- `src/pages/Home.jsx` and `src/pages/Movies.jsx` — placeholder pages with porting notes.
- `src/components/MovieCard.jsx` — small presentational component.
- `src/styles.css` — local styles for the React app.

How to run (Windows - PowerShell)

1. Open PowerShell in the project root (the folder that contains `react-app` and the original files).

2. Change to the `react-app` folder:

```powershell
cd "c:\Users\eagle\OneDrive\Desktop\Web Development Projects\FrontEnd\JavaScript\Final Project\react-app"
```

3. Install dependencies:

```powershell
npm install
```

4. Start the dev server:

```powershell
npm run dev
```

This will start Vite and open a local dev server (it will print the URL in the terminal).

Porting notes & next steps

- The scaffold intentionally keeps placeholder content. To complete the conversion:
  - Open your original `index.html`, `index.js`, `movies.html`, and `movies.js`.
  - Move UI markup into `Home.jsx` / `Movies.jsx` as JSX. Replace direct DOM manipulation with React state/hooks.
  - Turn data arrays (movie lists) into React state; if the original used fetches, call them in `useEffect`.
  - Move helper functions into separate modules under `src/` and import them.
  - Reference images from `assets/` either by placing them in `react-app/public/assets` (recommended) or using absolute paths like `/assets/...` if you keep them at project root and serve them.

Optional improvements

- Add ESLint/Prettier, TypeScript, or tests.
- Replace BrowserRouter basename if you will host under a subpath.

If you want, I can now:

- Port `index.html` + `index.js` -> `Home.jsx` and `movies.html` + `movies.js` -> `Movies.jsx` for you (I will need the contents of those files or permission to read them).
- Add TypeScript definitions or unit tests.

Tell me which part you'd like me to do next (e.g., "please port index.js into Home.jsx"), and I will continue.
