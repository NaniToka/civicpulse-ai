# CivicPulse AI Frontend

This is the frontend cockpit for CivicPulse AI, providing a visual decision-support platform for policymakers to explore geographic demand intelligence, citizen feedback, and priority scores.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Icons**: Lucide React
- **Linting**: ESLint

## Getting Started

### Prerequisites
- Node.js v18 or higher (Node 20/22 recommended)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port specified by Vite).

### Build for Production
To create a production-ready static site build:
```bash
npm run build
```
The optimized files will be output to the `dist` directory.

### Linting & Code Quality
To run the ESLint linter across the TypeScript and TSX files:
```bash
npm run lint
```

## Project Structure
- `src/`: Contains the React application, components, services, and styling.
- `public/`: Static assets.
- `index.html`: Entry point for the Vite application.
