# PropertyDeals - Off-Market Real Estate Platform

## Overview

PropertyDeals is a comprehensive full-stack web application designed as an off-market real estate platform connecting property owners, buyers, sellers, and real estate professionals (REPs). The platform facilitates private property transactions without traditional MLS listings, featuring user authentication, property management, messaging systems, and specialized tools for real estate professionals.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: Radix UI components with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Dual authentication system supporting both Passport.js (local) and Supabase Auth
- **API Design**: RESTful API endpoints with structured error handling
- **File Processing**: ESBuild for server-side bundling

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon Database)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: Memory store for development, configurable for production

## Key Components

### Authentication System
- **Dual Provider Support**: Supabase Auth for modern authentication with Passport.js fallback
- **User Roles**: Multi-role system supporting buyers, sellers, and REPs with approval workflows
- **Profile Management**: Comprehensive user profiles with onboarding flows
- **Session Management**: Secure session handling with middleware protection

### Property Management
- **Property Listings**: Full CRUD operations for off-market properties
- **Property Profiles**: Draft/live listing system for staged property management
- **Search & Filtering**: Advanced property search with location, price, and feature filters
- **Recommendations**: Custom recommendation engine based on user preferences

### User Management
- **Role-Based Access**: Granular permissions for different user types
- **Profile Completion**: Progress tracking for user onboarding
- **Buyer Preferences**: Detailed preference management for property matching
- **REP Directory**: Professional directory with specializations and ratings

### Communication Features
- **Messaging System**: Direct messaging between users
- **Property Inquiries**: Structured inquiry system for property interest
- **Discussion Forums**: Community features for property discussions
- **Notifications**: Real-time updates for user interactions

### Real Estate Tools
- **Flip Calculator**: ROI and profit analysis for fix-and-flip investments
- **Investment Calculator**: Cash flow and cap rate analysis for rental properties
- **Property Dictionary**: Comprehensive real estate terminology reference

## Data Flow

### User Authentication Flow
1. User registers/signs in through Supabase Auth or local authentication
2. Authentication middleware validates tokens/sessions
3. User profiles are automatically created or synchronized
4. Role-based permissions are enforced throughout the application

### Property Management Flow
1. Sellers create property profiles in draft status
2. Properties undergo review process before going live
3. Published properties are indexed for search and recommendations
4. Buyers can search, filter, and save favorite properties
5. Direct communication is facilitated between interested parties

### REP Integration Flow
1. Real estate professionals register with specialized profiles
2. REPs are categorized by specialization (inspectors, appraisers, lenders, etc.)
3. Users can search and connect with REPs based on location and expertise
4. REPs can showcase past deals and maintain professional profiles

## External Dependencies

### Core Services
- **Supabase**: Primary authentication provider and potential database hosting
- **Neon Database**: PostgreSQL hosting with serverless scaling
- **Google Maps API**: Location services and mapping functionality

### Development Tools
- **Replit**: Development environment with integrated hosting
- **Vite Plugins**: Development tooling including theme management and error overlays
- **Drizzle Kit**: Database schema management and migrations

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **React Query**: Server state management and caching

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit's development environment
- **Hot Module Replacement**: Vite-powered development server with instant updates
- **Environment Variables**: Separate configuration for development and production

### Production Build
- **Frontend**: Static assets built with Vite and served from `/dist/public`
- **Backend**: Server bundled with ESBuild for optimal performance
- **Database**: PostgreSQL with Drizzle migrations for schema management
- **Scaling**: Configured for Replit's autoscale deployment target

### Configuration Management
- **Environment Variables**: Supabase credentials and database URLs
- **Build Scripts**: Automated build process for both client and server
- **Port Configuration**: Multiple ports configured for different services

## Changelog

- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.