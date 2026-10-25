# ResumeForge

ATS-friendly resume builder: live A4 preview with real pagination, six templates,
font pairings, accent colours, section re-ordering, photo crop, JSON import/export.
Everything runs in the browser; data is stored in `localStorage`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in dist/
npm run lint     # tsc --noEmit
```

## PDF export

**Download PDF** uses the browser's native print pipeline (choose *Save as PDF*).
That produces a vector PDF with real, selectable text — which is what ATS parsers
need — and adds nothing to the bundle. The page margins are applied to every page
and the browser's date/URL header & footer are suppressed.

## JSON import

Hand-written or partial JSON is normalised on import and on load: missing
`meta.*` fields fall back to the template defaults, and any section that is
missing from `meta.sectionOrder` is appended so it never silently disappears.
