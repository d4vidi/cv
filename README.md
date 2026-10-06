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
