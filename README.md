# Cover Letter Architect

A modern tool to build perfectly personalized cover letters using modular content blocks and AI, while keeping your unique writing voice.

## 1. Goal Product

The ultimate goal of **Cover Letter Architect** is to eliminate the blank-page syndrome of job applications. It allows users to maintain a "library" of their own professional experiences and skills (content blocks), which are then intelligently assembled into a coherent, role-specific cover letter using Google Gemini. The product aims to be the bridge between "generic AI templates" and "authentic personal branding."

## 2. Current Product

The current version is a fully functional web application featuring:

- **Block Library**: Save and manage modular snippets (Experience, Education, Projects, etc.).
- **Target Context**: Quick fields for Company and Role details to ground the AI generation.
- **AI Assembler**: Integration with Google Gemini (1.5 Flash, 2.0 Flash Exp, etc.) to draft letters.
- **Live Preview**: Real-time Markdown rendering with specific highlighting for content derived from your personal blocks.
- **Suggestions Mode**: Interactive highlighting of "weak phrases" in your draft with AI-driven improvement suggestions.
- **Markdown Export**: One-click download of your letter with proper date/company naming conventions.
- **Modern Polish**: Responsive UI with automated dark mode support and Radix UI primitives.

## 3. How to Clone & Run

### Prerequisites

- Node.js 18+ installed.
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (optional if provided as environment variable).

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/0xshey/cover-letter-architect.git
   cd cover-letter-architect
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment (Optional)**:
   Create a `.env.local` file to avoid entering your API key every session:

   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

Built with Next.js, TypeScript, Tailwind CSS, Radix UI, and Google Gemini.
