# DevFlow AI Landing Page

## Overview

DevFlow AI is a B2B SaaS landing page for an AI workflow optimization service targeting engineering teams. The application helps companies maximize ROI from their AI development tools by providing systematic workflows and training. The landing page showcases the service's value proposition, pricing tiers, an interactive ROI calculator, and a lead capture form for booking workflow audits.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with custom dark theme configuration
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for complex animations and gestures
- **Charts**: Recharts for data visualization (ROI calculator)
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with type-safe schemas
- **Build System**: Vite for frontend, esbuild for backend bundling via custom build script

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Current Tables**: `audit_requests` for storing lead capture form submissions

### Project Structure
```
├── client/           # Frontend React application
│   └── src/
│       ├── components/   # UI components and sections
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities (query client, cn helper)
│       └── pages/        # Route page components
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod schemas
└── migrations/       # Database migrations
```

### Type Safety Pattern
The codebase uses a shared schema approach where:
1. Database schemas are defined with Drizzle in `shared/schema.ts`
2. API input/output schemas are derived using `drizzle-zod`
3. Both client and server import from shared directory for consistent typing

### Development vs Production
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Static build served from `dist/public`, bundled server in `dist/index.cjs`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### UI Framework Dependencies
- **Radix UI**: Accessible component primitives (dialogs, forms, accordions, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom dark theme
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Safe Tailwind class merging

### Third-Party Libraries
- **Framer Motion**: Animation library for landing page effects
- **Recharts**: Charting library for ROI calculator visualization
- **Zod**: Schema validation for API inputs and form validation
- **date-fns**: Date formatting utilities

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development banner (dev only)