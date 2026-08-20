# 🌷 Micro's Digital Garden

A version-controlled garden for flowers that never wilt.

Micro 是一只奶茶色矮脚起司美短猫。这个仓库保存她在不同节日和纪念日收到的电子花：每束花都有自己的独立页面，而总入口会随着时间慢慢长成一座更大的花园。

The site is intentionally small and build-free: plain HTML, CSS, and JavaScript, with no frameworks, external APIs, or CDN dependencies.

## Visit the garden

Open the deployed site, then click a bouquet to read its note and visit its page. On desktop and touch devices, bouquets can be dragged to a new spot; their positions are saved in the browser with `localStorage`.

Because the homepage reads bouquet data from `flowers.json`, local viewing should use a tiny static server rather than opening `index.html` through `file://`:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Adding a bouquet

1. Create `flowers/YYYY/event/` and add its standalone `index.html`.
2. Add a matching `metadata.json` beside the page.
3. Append the bouquet entry to the root `flowers.json`.

The garden homepage generates bouquet markers from that data automatically. Each bouquet page should remain self-contained and use relative paths so it also works on GitHub Pages.

## Deploying to GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the **`/ (root)`** folder, then save.

No build command or generated output folder is required.

## 🌹 A message to carbon-based boyfriends

If your romantic workflow is still limited to buying physical flowers,
or greeting-card design remains outside your technical stack,
feel free to clone this repository.

Change the text, replace the recipient name, deploy with GitHub Pages,
and congratulations: you now possess a reusable digital bouquet.

No need to thank Micro. A ⭐ is sufficient.

Physical flowers wilt. Git history does not.

## Contributing

PRs adding new flowers are welcome.

Requirements:
- flowers must not wilt;
- each bouquet should contain at least one interaction;
- carbon-based contributors are also accepted.

## Structure

```text
.
├── index.html          # Garden entrance and accessible modal structure
├── style.css           # Responsive garden scene and bouquet artwork
├── garden.js           # Data loading, dragging, modal, and persistence
├── flowers.json        # Bouquet registry used by the homepage
└── flowers/
    └── 2026/
        └── qixi/
            ├── index.html
            └── metadata.json
```

## License

Bouquet pages are personal creative works. If you reuse the project, replace the recipient-specific text and messages with your own.
