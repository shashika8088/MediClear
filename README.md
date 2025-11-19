# MedCare

**Description:** MedCare is a small AI-powered web app built with Vite + TypeScript that demonstrates a simple medical report input and analysis UI. The app uses the Gemini API for LLM functionality via `services/geminiService.ts` to process user input and show results.


**Highlights:**

- **Frontend:** `Vite` + `React` + `TypeScript` (`index.tsx`, `App.tsx`)
- **Components:** `components/ReportInput.tsx`, `components/ReportResult.tsx`, `components/Icons.tsx`
- **Service:** `services/geminiService.ts` — wrapper to call the Gemini API

**Prerequisites**

- Node.js (recommended 16+ or latest LTS)
- A Gemini API key (set as `GEMINI_API_KEY`)

## Quick Start

1. Install dependencies:

```pwsh
npm install
```

2. Create an environment file and set your Gemini API key:

```pwsh
# create a file named .env.local in the project root
# add the line below with your real key
GEMINI_API_KEY=your_api_key_here
```

3. Run the development server:

```pwsh
npm run dev
```

4. Open the app in your browser at the address printed by Vite (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` : Start local dev server
- `npm run build`: Build production assets
- `npm run preview`: Preview production build locally

## Environment Variables

- `GEMINI_API_KEY` : API key used by `services/geminiService.ts` to call the Gemini LLM.

## Project Structure (top-level)

- `index.html` : App entry HTML
- `index.tsx`, `App.tsx` : React entry and root component
- `components/` : UI components
- `services/geminiService.ts` : LLM integration
- `types.ts` : shared TypeScript types
- `vite.config.ts`, `tsconfig.json`, `package.json` : build and config files

## Notes & Next Steps

- This repo is a small demo; if you plan to deploy, make sure to keep the API key secret and use a server-side proxy or function to avoid exposing it in client code.
- Improve error handling and add tests for `geminiService` for production readiness.

## Contributing

Feel free to open issues or pull requests. For small improvements (docs, typing, UI tweaks), open a draft PR and I'll review.

## License

This project does not include a license file. Add one (for example `MIT`) if you plan to open-source it.

---

If you want, I can also: add a `.env.example`, wire a server-side proxy for the API key, or commit these changes for you.