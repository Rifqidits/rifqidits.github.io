# rifqidits.github.io

Personal portfolio — built from scratch with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools.

[![Live](https://img.shields.io/badge/Live-rifqidits.github.io-0071e3?style=flat&logo=googlechrome&logoColor=white)](https://rifqidits.github.io)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Features

- Single-column hero layout with stats strip
- Interactive 3D skills globe (Fibonacci sphere distribution, mouse + touch drag)
- Work gallery with click-to-open modal (image, description, tags, action links)
- Five project detail pages with syntax-highlighted implementation code and copy button
- Dark / light mode toggle persisted to `localStorage`
- Scroll-spy pill navigation, intersection observer animations, scroll-to-top
- Contact form via Formspree
- Fully responsive down to mobile

---

## Structure

```
rifqidits.github.io/
├── index.html               # Main portfolio page
├── assets/                  # Images and visual assets
├── css/
│   ├── style.css            # Global design system & all component styles
│   └── project-page.css     # Styles specific to project detail pages
├── js/
│   ├── script.js            # Main page interactions (nav, modal, animations)
│   ├── sphere.js            # 3D skills globe renderer
│   └── project-page.js      # Project page interactions (theme, copy button)
└── projects/
    ├── tertata/             # terTATa-LLM — LoRA fine-tuning, Datathon 2025
    ├── rainscale/           # RainScale-EDSR — precipitation super-resolution
    ├── pacs/                # PACS — chest X-ray pathology classification
    ├── bikeshare/           # Bikeshare — Streamlit demand forecasting dashboard
    └── rfid/                # RFID — embedded access control system
```

---

## Running Locally

No build step required — open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python -m http.server 8000
```
