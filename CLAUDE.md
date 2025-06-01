# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

### Development

- `npm run dev` - Start Vite dev server for local development
- `npm run start` - Start Wrangler dev server (Cloudflare Workers runtime)
- `npm run build && npm run start` - Test on workerd runtime locally

### Testing & Quality

- `npm run test` - Run Playwright tests with UI mode
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking and generate Wrangler types
- `npm run format` - Format code with Prettier

### Deployment

- `npm run deploy` - Deploy to Cloudflare Workers production

### Database & Types

- `npm run typegen` - Generate environment types from wrangler.toml and
  .dev.vars

## Architecture

This is a Remix application deployed on Cloudflare Workers with the following
key architectural patterns:

### Backend Layer (Clean Architecture)

The backend follows a layered architecture pattern:

- **Domain Models** (`app/backend/domain/models/`): Core business entities
  (Product, DiscountHistory, Gender)
- **Application Services** (`app/backend/application/`): Business logic
  orchestration layer
- **Infrastructure** (`app/backend/infrastructure/`): Data access repositories
  using Prisma
- **Error Handling** (`app/backend/errors/`): Custom error types for the
  application

### Database

- Uses **Cloudflare D1** (SQLite) as the database
- **Prisma ORM** with D1 adapter for database operations
- Database connection is configured through `load-context.ts` which creates
  PrismaClient with D1 adapter
- Migration files are in `/migrations/` directory

### Data Flow

1. Remix routes handle HTTP requests
2. Routes call Application Services for business logic
3. Services use Infrastructure Repositories for data access
4. Repositories use Prisma with D1 adapter to query the database

### Frontend

- **Remix** with React for SSR/client-side rendering
- **Tailwind CSS** for styling with custom UI components in `app/components/ui/`
- **Radix UI** components for accessible UI primitives

### Key Integration Points

- `load-context.ts` - Configures database connection for each request context
- `app/database/client.ts` - Database connection factory using Prisma D1 adapter
- Application Services receive PrismaClient through dependency injection pattern

### Environment Configuration

- Local secrets in `.dev.vars` file
- Environment variables in `wrangler.toml` vars section
- D1 database binding configured in wrangler.toml
- Type generation available via `npm run typegen`
