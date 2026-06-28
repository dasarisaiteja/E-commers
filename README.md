# React + Vite
# Aura Glass E-Commerce Client (Frontend)
This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.
Welcome to the frontend codebase for **Aura Glass E-Commerce**, a state-of-the-art web application featuring a stunning premium **Glassmorphism & Neon Aura design system**. It integrates React with Redux Toolkit for cart state management, React Context for user authentication, and interacts with a backend API.
Currently, two official plugins are available:
---
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
## 🎨 Design System & Aesthetics
- **Glassmorphism**: Translucent card panels using modern CSS `backdrop-filter` rules, subtle borders, and smooth shadows.
- **Neon Glows**: Dynamic radial glow elements (`.bg-blobs`) that drift slowly behind the UI.
- **Harmonious Palette**: Styled using HSL tailormade colors (deep space dark mode, bright accent cyans, neon purples, and amber glows).
- **Responsive Layout**: Designed to adapt dynamically to mobile, tablet, and desktop viewports.
## React Compiler
---
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
## 🏗️ Architecture & State Management
## Expanding the Oxlint configuration
This frontend app uses a hybrid state management structure for maximum clean-code principles:
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
1. **Redux Toolkit & React Redux (Cart State)**
   - Manages all shopping cart activities.
   - Files:
     - [store.js](src/redux/store.js): Store configuration.
     - [cartSlice.js](src/redux/slices/cartSlice.js): Reducers, action creators, and memoized selectors.
   - Features:
     - Incremental quantity updates, custom quantites, and item removals.
     - Auto-synchronization to `localStorage` for cart persistence across reloads.
     - Selectors like `selectCartCount` and `selectCartTotal` to derive values efficiently.
2. **React Context API (Auth State)**
   - Manages user session tokens, login status, and logout flows.
   - Files:
     - [AuthContext.jsx](src/context/AuthContext.jsx): Stores token and decoded user data.
---
## 🚀 Getting Started
### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
### Running Locally
To launch the React + Vite development server:
```bash
npm run dev
```
The application will default to running on `http://localhost:5173`.
### Building for Production
To generate a fully optimized and bundled production build:
```bash
npm run build
```
The output assets will be created in the `dist` directory.
---
## 📄 Pages Walkthrough
- **Home Page (`/`)**: Dynamic catalog showing products with live search query filtering, category tabs, min/max price slider, and sorting metrics (price, rating, newness).
- **Product Details (`/product/:id`)**: Rich single-product viewport featuring detailed reviews, stocks counts, rating badges, custom quantity stepper, and "Buy Now" routes.
- **Authentication (`/auth`)**: Sign In / Sign Up portal styled with high-end transparent form blocks.
- **Checkout (`/checkout`)**: Reviews items, displays total summaries, checks authentication, and processes mock credit card payments before persisting orders to the backend.
- **Success (`/success`)**: Confirms transaction success and shows order confirmation metadata.
---
## 🛠️ Technology Stack
- **Core Library**: React (v19)
- **State Management**: Redux Toolkit & React Redux
- **Router**: React Router DOM (v7)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linter**: Oxlint
