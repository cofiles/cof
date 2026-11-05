# Interface update

The four supplied videos were inspected locally as timestamped frame sequences.

- Primary reference, 3–8 s: near-black palette, acid-lime accent, sans-serif / italic serif heading.
- Primary reference, 8–19 s: luminous curved strands behind frosted glass, an animated branching diagram; 19–21 s: continuation into the lower sections.
- Supplementary reference, 0–4 s and 21–24 s: the same visual direction on desktop and mobile.
- Glass reference: refractive edges, translucent controls and responsive pressed states. This static implementation uses an SVG displacement map behind control content, with a CSS blur fallback. It does not require React or external CDNs.
- Search reference, item 5: the section heading slides away, the search bar rises and Cancel slides in. Cancel / Escape clear the query and restore the heading. Existing catalog filters remain connected.

## Changed files

`assets/layers.css` and `assets/layers.js` hold the shared visual and interaction layer. All 12 HTML pages load them. `index.html` has the new hero, linked diagram and section search. Translations and the favicon match the new design.

`assets/experience.js` animates a viewport-sized light stream through the introduction, route selector, catalog and footer. Scroll position controls the bend, width and direction in both directions. The diagram supports dragging, arrow keys, zoom and reset. On desktop, scrolling through the three routes updates a sticky preview. On mobile the selected tab controls the preview. Both pause controls stop the stream and diagram, and the renderer suspends in a hidden tab. Reduced-motion preferences display a static scene.

## Verification

- `python -X utf8 validate_site.py`: PASS, 109 groups, 109109 placements, 85468 distinct URLs, 12 HTML pages.
- `node --check assets/layers.js`: PASS.
- Browser: desktop and 390 px mobile layout; dark/light theme; Russian/English; homepage search and cancellation; Python search for `requests`; package selection, pinned versions and selection retention when clearing search.

This is an adaptation of the videos to the existing catalog, not the original site's source code or a claim of pixel-identical reproduction. Browser support for SVG backdrop displacement varies; standard glass blur remains available. No deployment was performed.

Development-only frames and a pre-edit backup are in `.qa/`, excluded from Git and the delivery ZIP.
