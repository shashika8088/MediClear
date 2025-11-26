# 🩺 MedCare — AI-Powered Medical Report Simplifier

MedCare is a modern, multilingual web application that simplifies complex medical reports using AI.  
Built with **Vite + React + TypeScript**, powered by the **Gemini API**, and enhanced with **Text-to-Speech** and **full multilingual translation**.

Users can upload or paste a medical report, and the app generates:

- A simplified summary  
- Key takeaways  
- A glossary of medical terms  
- A disclaimer  
- A translated version of the entire report (English, Hindi, Kannada, Tamil)  
- A voice readout (speech) of the summary or full report  

---

## ✨ Features

### 🔍 AI-Powered Medical Report Analysis  
- Processes text or report images  
- Generates a friendly, easy-to-understand explanation  
- Extracts key points & glossary definitions  
- Removes personal information automatically  

### 🌐 Multilingual Full Report Translation  
Translates **ALL SECTIONS** of the report:
- Summary  
- Key Takeaways  
- Glossary  
- Disclaimer  

Supported languages:
- **English**
- **Hindi**
- **Kannada**
- **Tamil**

### 🔊 Text-to-Speech (Voice Readout)
- Reads aloud the **summary** or the **entire report**
- Uses browser’s native Web Speech API  
- Supports all available device voices for selected language  

### 🖼 Supports Text or Image Input
- Upload a screenshot / photo of a medical report  
- Paste raw medical text  

### ⚡ Fast & Lightweight
- Powered by Vite  
- Smooth, responsive React UI  
- Instant rendering  

---

## 🛠 Tech Stack

**Frontend:**  
- React  
- TypeScript  
- TailwindCSS  
- Vite  

**AI / Backend:**  
- Google Gemini API  
- Rich system prompts  
- JSON response parsing  

**Browser APIs:**
- Web Speech API (Text-to-Speech)

**Deployment:**  
- **Vercel**

---

## 📂 Project Structure
```
├── components/
│ ├── ReportInput.tsx
│ ├── ReportResult.tsx
│ └── Icons.tsx
├── services/
│ └── geminiService.ts
├── types.ts
├── App.tsx
├── index.tsx
public/
index.html
vite.config.ts
tsconfig.json
package.json

---
```

## 🚀 Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/shashika8088/MediClear.git
cd MediClear
```

### 2. Install Dependencies

```sh
npm install
```
### 3.Create Environment File
Inside the project root, create .env.local:
```
GEMINI_API_KEY=your_api_key_here
```
### 4.Run Development Server
```
npm run dev


