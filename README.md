# Task Scribe Toolkit

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS.

![Task Scribe Toolkit](public/placeholder.svg)

## Features

- 📱 Fully responsive design for mobile and desktop
- 🎨 Beautiful UI with light/dark mode support
- ✨ Modern drag-and-drop task reordering
- 🔍 Advanced filtering and sorting options
- 📊 Task statistics and progress tracking
- 👤 User authentication and profile management
- 📅 Due date management with calendar integration
- 🏷️ Priority levels and status management

## Tech Stack

- **Frontend:**
  - React with TypeScript
  - Tailwind CSS for styling
  - ShadcnUI components
  - Vite for build tooling
  - React Context for state management

- **Backend:**
  - Node.js with Express
  - Prisma ORM
  - SQLite database
  - JWT authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-scribe-toolkit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd ../backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

## Project Structure

```
task-scribe-toolkit/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and API clients
│   ├── pages/         # Page components
│   └── types/         # TypeScript type definitions
└── backend/
    ├── prisma/        # Database schema and migrations
    └── src/           # Backend source code
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

For the backend, create a `.env` file in the backend directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) for the icon set