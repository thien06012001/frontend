# Frontend Application

## Overview

This is a modern frontend web application built using:

- **React** with **TypeScript** for UI development
- **Vite** as the build tool and dev server
- **Redux Toolkit** for state management
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v20 or higher recommended)
- **npm** or **yarn**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/thien06012001/frontend.git
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   #or
   bun install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and include:

   ```env
   VITE_API_BASE_URL=<your-api-url>
   VITE_SECRET_KEY=<your-secret-key>
   ```

4. Set up environment variables:

   Using these credentials to login as user:

   ```env
   default@default.com
   default
   ```

   Using these credentials to login as admin:

   ```env
   admin@admin.com
   admin
   ```

## Scripts

Available npm/yarn scripts:

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview the production build locally
- `lint` - Run ESLint
- `format` - Format code with Prettier

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Running the App

To start the app in development mode:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`

To preview the production build:

```bash
npm run build
npm run preview
```

The app will be available at `http://localhost:4173`

## Contributing

Feel free to submit issues or pull requests for improvements or new features.

## License

No license has been specified yet. You can add a `LICENSE` file to define usage permissions.
