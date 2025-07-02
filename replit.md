# RecruitFlow - Recruitment Management System

## Overview

RecruitFlow is a modern recruitment management system built with a React frontend and Express.js backend. The application helps organizations manage their recruitment pipeline by tracking candidates through different phases, scheduling interviews, and maintaining recruitment data. The system is designed as a full-stack TypeScript application with a focus on user experience and data management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API design
- **Development**: Hot module replacement with Vite middleware

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Migration**: Drizzle Kit for schema migrations
- **Schema**: Centralized schema definitions in `shared/schema.ts`

## Key Components

### Data Models
The application manages four primary entities:
1. **Users**: Authentication and user management
2. **Candidates**: Recruitment candidates with phases, status tracking, and personal information
3. **Interviews**: Scheduled interviews linked to candidates with type, status, and feedback
4. **Dashboard Stats**: Aggregated statistics for dashboard reporting

### Frontend Pages
- **Dashboard**: Overview with statistics, activity feed, and quick actions
- **Phase 1 Candidates**: Management of initial candidate screening
- **Phase 2 Candidates**: Advanced candidate management with interview scheduling
- **Interviews**: Interview scheduling and management interface
- **Candidate Profile**: Detailed view of individual candidates
- **Settings**: Application configuration and user management

### API Endpoints
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/candidates` - List candidates with filtering
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/:id` - Get candidate details
- `PUT /api/candidates/:id` - Update candidate
- `GET /api/interviews` - List interviews with filtering
- `POST /api/interviews` - Schedule new interview

## Data Flow

### Client-Server Communication
1. **React Components** make API calls through custom hooks
2. **TanStack Query** manages caching, synchronization, and error handling
3. **Express Routes** handle HTTP requests and business logic
4. **Storage Layer** (currently in-memory, designed for database integration)
5. **Database Operations** through Drizzle ORM

### State Management Pattern
- Server state managed by TanStack Query with automatic caching
- Form state handled by React Hook Form
- UI state managed by React component state
- Theme state persisted in localStorage

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Data and Validation
- **Zod**: Schema validation library
- **date-fns**: Date manipulation utilities
- **TanStack Query**: Server state management

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Migrations run via `drizzle-kit push`

### Environment Configuration
- **Development**: Uses Vite dev server with Express API proxy
- **Production**: Express serves static files and API endpoints
- **Database**: Configured via `DATABASE_URL` environment variable

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon Database recommended)
- Static file serving capability
- Environment variable support

## Changelog

Changelog:
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.