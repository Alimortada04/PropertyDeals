# PropertyDeals Platform

## Overview
PropertyDeals is a full-stack web application for off-market real estate transactions, connecting property buyers, sellers, and real estate professionals (REPs). Built with modern web technologies including React, Node.js, PostgreSQL, and Supabase authentication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React Context for local state
- **UI Components**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth integrated with custom middleware
- **API Design**: RESTful endpoints with TypeScript type safety
- **File Uploads**: Supabase Storage for images and documents

### Database Schema
- **Users**: Core user accounts with role-based access (buyer, seller, rep)
- **Buyer Profiles**: Extended user profiles with preferences and settings
- **Properties**: Property listings with detailed metadata
- **Property Profiles**: Draft/live property management system
- **REPs**: Real estate professionals directory
- **System Logs**: Admin audit trails
- **User Reports**: Content moderation system

## Key Components

### Authentication System
- Supabase authentication with email/password and social providers
- Role-based access control (buyer, seller, rep, admin)
- Profile creation triggers for new user registration
- Session management with Express middleware

### Property Management
- Multi-step property listing creation
- Draft and published states for listings
- Property search and filtering system
- Recommendation engine for property matching
- Geographic search capabilities

### User Dashboard System
- Role-specific dashboards (buyer, seller, rep)
- Property management interfaces
- Analytics and performance tracking
- Communication tools and messaging

### REP (Real Estate Professional) Directory
- Searchable directory of contractors, agents, lenders, etc.
- Profile pages with portfolios and reviews
- Service categorization and filtering
- Contact and connection features

## Data Flow

### User Registration Flow
1. User signs up via Supabase Auth
2. Database trigger creates profile record
3. Onboarding process collects additional information
4. Role-specific profile creation based on user type

### Property Listing Flow
1. Seller creates property draft in Property Profiles table
2. Multi-step form collects property details and images
3. Property published to live Properties table
4. Search indexing and recommendation engine updates

### Property Discovery Flow
1. Search queries filter properties by location, price, type
2. Recommendation engine suggests relevant properties
3. Map-based visualization for geographic search
4. Property detail pages with contact forms

## External Dependencies

### Core Infrastructure
- **Neon Database**: Managed PostgreSQL hosting
- **Supabase**: Authentication, file storage, and real-time features
- **Google Maps API**: Location services and mapping
- **React Query**: Server state management and caching

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Icon library
- **shadcn/ui**: Component design system

### Development Tools
- **Drizzle ORM**: Type-safe database queries
- **Zod**: Runtime type validation
- **React Hook Form**: Form state management
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development Environment
- Replit hosting with hot reload
- Development server on port 3000
- PostgreSQL module for local database
- Environment variables for Supabase configuration

### Production Build
- Vite builds frontend to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Static file serving from Express
- Database migrations via Drizzle Kit

### Environment Configuration
- Supabase URL and anonymous key for authentication
- Database URL for PostgreSQL connection
- Session secrets for Express session management
- Google Maps API key for location services

## Changelog
- June 23, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.