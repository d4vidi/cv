# Interactive CV

Amit Davidi's CV as a single interactive page: a timeline of floating "bubbles", one per
employer or role, each opening a detail dialog. Built with React + Vite.

## Development

```sh
yarn install
yarn dev        # local dev server with hot reload
yarn build      # static production build → dist/
yarn preview    # serve dist/ locally
```

Add `?static` to the URL (e.g. `http://localhost:5173/?static`) for a non-interactive
single-pager: every entry is a full-width card with its circle beside the headline, with no
dialogs and no animations.
It's laid out for A4 printing, so the browser's "Save as PDF" gives a clean 3-page CV.

`dist/` is fully static and uses relative paths, so it can be hosted from any path
on any static host.

## Where things live

- `src/data/cv.js` holds all content: profile, timeline entries (bubble labels + dialog
  details), education and skills.
- `src/components/Intro.jsx` holds the intro paragraph (JSX, for the inline highlights).
- `src/components/Timeline.jsx` holds the hand-tuned bubble layout (sizes, offsets, font sizes).
- `src/styles/global.css` holds the visual styles.

The original design export from Claude Design (`Pop.dc.html` + runtime) is in git history
(commit `1eb7d0e`).
