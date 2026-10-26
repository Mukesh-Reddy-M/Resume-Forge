<div align="center">

# 🚀 ResumeForge

**Build, customize, preview, and export professional ATS-friendly resumes, all in your browser.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge)](https://mukesh-reddy-m.github.io/Resume-Forge/)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

[**Try it live →**](https://mukesh-reddy-m.github.io/Resume-Forge/)

</div>

---

## 📖 About

ResumeForge is a web-based resume builder with a live A4 preview, six switchable templates, deep style customization, and one-click PDF export. Everything runs client-side, so **your data never leaves your browser**.

## ✨ Features

### 📝 Editor
- Personal info, professional summary, work experience, education, skills, and projects
- Custom sections for anything else you want to highlight
- Drag-and-drop bullet reordering

### 🎨 Templates & Styling
| Template | Style |
|---|---|
| Classic | Traditional and clean |
| Modern Sidebar | Two-column with sidebar |
| Minimal Sans | Simple and airy |
| Executive | Formal and polished |
| Compact Tech | Dense, built for technical roles |
| Creative Bold | Eye-catching and expressive |

Customize **font pairings**, **accent colors**, **layout density**, and **photo settings** (crop and shape).

### 👀 Live Preview
- Real-time A4 preview as you type
- Mobile-friendly layout with separate **Edit / Preview / Style** panels

### 📄 Import & Export
- **PDF export** via the browser print dialog
- **JSON export/import** for backup and reuse
- **Auto-save** to local storage
- One-click restore of the sample resume

## 🛠️ Tech Stack

| Tech | Purpose |
|---|---|
| React + TypeScript | UI and type safety |
| Vite | Dev server and build tooling |
| Tailwind CSS | Styling |
| dnd-kit | Drag-and-drop |
| react-easy-crop | Photo cropping |
| Lucide React | Icons |

## 🚀 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) (LTS) and npm.

```bash
# 1. Clone
git clone https://github.com/Mukesh-Reddy-M/Resume-Forge.git
cd Resume-Forge

# 2. Install
npm install

# 3. Run (http://localhost:3000)
npm run dev
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | TypeScript type check |

## 🌐 Deployment

The app is deployed with **GitHub Pages**. To deploy your own copy, make sure `vite.config.ts` has the correct base path:

```ts
export default defineConfig({
  base: '/Resume-Forge/',
  // ...
});
```

You can also deploy the `dist/` folder to Vercel or Netlify with no extra configuration.

## 🔒 Data & Privacy

- Resume data is stored **only in your browser's local storage**
- No accounts, no servers, no tracking
- Export a JSON backup regularly, because clearing browser data erases saved resumes
- Avoid entering sensitive personal information on devices you don't trust

## 🗂️ Project Structure

```
Resume-Forge/
├── .github/workflows/   # CI / deployment
├── src/
│   ├── components/      # editor, modals, navbar, preview, style
│   ├── data/            # sample resume data
│   ├── lib/             # helpers
│   ├── templates/       # the 6 resume templates
│   ├── types/           # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

## 🗺️ Roadmap

- [ ] More templates and layouts
- [ ] Extra export formats
- [ ] Resume validation and writing tips
- [ ] Accessibility and mobile polish
- [ ] Optional cloud backup and sync

## 🤝 Contributing

Contributions, ideas, and bug reports are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

## 📜 License

Released under the [MIT License](LICENSE). *(Add a `LICENSE` file to the repo root to make this link work.)*

## 👤 Author

**Mukesh Reddy**
[GitHub](https://github.com/Mukesh-Reddy-M) · [LinkedIn](https://www.linkedin.com/in/mukesh-reddy-moola-6956631b9)

---

<div align="center">

⭐ If you found this useful, consider starring the repo!

</div>
