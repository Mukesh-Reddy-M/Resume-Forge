ResumeForge 🚀

Build, customize, preview, and export professional resumes — all in one place.

ResumeForge is a web-based resume builder built with React, TypeScript, and Vite. It provides an interactive editing experience with multiple resume templates, real-time preview, customizable styling, and PDF export.

✨ Features

📝 Resume Editor

- Personal Information: Edit your name, contact details, and other basic information.
- Professional Summary: Create and refine your resume summary.
- Work Experience: Add and edit professional experience entries.
- Education: Organize your academic qualifications.
- Skills: Manage your technical and professional skills.
- Projects: Showcase projects and their descriptions.
- Custom Sections: Add additional sections to highlight relevant information.
- Drag-and-Drop Bullets: Reorder bullet points easily.

🎨 Templates & Customization

Choose from multiple resume templates designed for different professional styles:

- Classic
- Modern Sidebar
- Minimal Sans
- Executive
- Compact Tech
- Creative Bold

Customize your resume's appearance with:

- Font pairings
- Accent colors
- Layout density
- Photo settings where supported
- Photo cropping and shape options

👀 Live Preview

- Preview your resume while editing.
- See content and styling changes in real time.
- Switch between editing, preview, and styling panels on mobile.
- Use a responsive interface designed for different screen sizes.

📄 Import & Export

- PDF Export: Open the print dialog and save your resume as a PDF.
- JSON Export: Download resume data for backup or reuse.
- JSON Import: Import previously exported resume data.
- Persistent Storage: Save resume content and styling in your browser's local storage.
- Sample Resume: Restore the default sample resume when needed.

🛠️ Tech Stack

Technology| Purpose
React| User interface
TypeScript| Type-safe development
Vite| Development server and build tooling
Tailwind CSS| Styling
dnd-kit| Drag-and-drop interactions
Lucide React| Icons
react-easy-crop| Photo cropping

🚀 Getting Started

Prerequisites

Install "Node.js" (https://nodejs.org/) and npm.

1. Clone the repository

git clone https://github.com/Mukesh-Reddy-M/Resume-Forge.git
cd Resume-Forge

2. Install dependencies

npm install

3. Start the development server

npm run dev

Open the local URL displayed in your terminal. The development server is configured to use port "3000".

To access the app from another device on the same network, you can run:

npm run dev -- --host 0.0.0.0

4. Build for production

npm run build

5. Preview the production build

npm run preview

6. Check TypeScript

npm run lint

📱 Running on Android with Termux

ResumeForge can also be developed and run locally on Android using Termux.

Install Node.js and Git, clone the repository, and run:

pkg install nodejs-lts git
git clone https://github.com/Mukesh-Reddy-M/Resume-Forge.git
cd Resume-Forge
npm install
npm run dev

Open the local development URL in your mobile browser.

Tip: Keep the project inside Termux's private home directory rather than shared Android storage to avoid certain file-permission issues.

💾 Data & Privacy

ResumeForge stores resume data in the browser's local storage for persistence between visits.

- Export your resume as JSON to keep a backup.
- Imported JSON files should contain valid resume data.
- Avoid entering sensitive personal information on devices or browsers you do not trust.
- Clearing browser storage may remove locally saved resume data.

🗂️ Project Structure

Resume-Forge/
├── src/
│   ├── components/
│   │   ├── editor/
│   │   ├── modals/
│   │   ├── navbar/
│   │   ├── preview/
│   │   └── style/
│   ├── data/
│   ├── lib/
│   ├── templates/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts

🗺️ Future Improvements

Potential enhancements include:

- Additional resume templates and layouts
- More export and formatting options
- Improved accessibility and mobile usability
- Additional resume validation and guidance
- Optional cloud-based backup and synchronization

🤝 Contributing

Contributions, ideas, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch to your fork.
5. Open a pull request.

📜 License

No license has been specified yet. Add a license file if you intend to define how others may use, modify, and distribute this project.

---

Built with ❤️ using React, TypeScript, and Vite.

"View ResumeForge on GitHub" (https://github.com/Mukesh-Reddy-M/Resume-Forge)
