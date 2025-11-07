# AGNI Network – Frontend

## Overview
The AGNI Network frontend is the client-side web application for the AGNI platform. It provides user interaction, communicates with backend APIs, and offers a responsive layout across devices.

## Features
- User authentication and authorization
- API integration with backend services
- Responsive UI for desktop and mobile
- Component-based architecture
- State management for consistent UI updates

## Tech Stack
- Framework: React
- Language: TypeScript
- UI / Styling: (TailwindCSS)
- Package Manager: npm or yarn

## Getting Started

### Prerequisites
- Node.js (latest LTS recommended)
- npm or yarn

### Installation
Clone the repo and install dependencies:
- git clone https://github.com/beong789/AGNI-Network.git
- cd AGNI-Network/agni-frontend
- npm install

### Run Development Server
- npm run dev
This starts the app at http://localhost:3000

### Build for Production
- npm run build
This outputs the production-ready files into the /build directory.

## Directory Structure
agni-frontend/
  public/               Public static files  
  src/
    components/         Reusable UI components
    pages/              Route-level components
    services/           API request logic
    store/              (Optional) State management
    styles/             Global or shared styles
    utils/              Helper functions
    index.tsx           Entry point
  .env                  Environment config (not committed)
  package.json
  README.md

## Environment Variables
Create a .env file in the project root (do not commit it):

REACT_APP_API_BASE_URL=<your_backend_api_url>

## Deployment
1. Run: npm run build
2. Deploy the generated build/ directory to hosting (Netlify, Vercel, AWS S3, etc.)
3. Ensure backend CORS allows your deployed domain.

## Contributing
1. Fork the repository
2. Create a new feature branch (git checkout -b feature/my-feature)
3. Commit changes (git commit -m "Description of changes")
4. Push branch (git push origin feature/my-feature)
5. Open a Pull Request

## License
MIT License 
