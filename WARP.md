# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Root Project (Frontend Assets)
- **Install dependencies**: `npm install`
- **Development build with watch**: `npm run dev` (runs `gulp`)
- **Production build**: `npm run build` (runs `gulp build`)
- **Lint backend JS**: `gulp` includes JSHint for backend JS files

### Angular Editor (_editor/_ directory)
- **Install dependencies**: `cd editor && npm install`
- **Development server**: `cd editor && npm start` (runs `ng serve` on http://localhost:4200)
- **Build for development**: `cd editor && npm run dev` (builds with watch)
- **Build for production**: `cd editor && npm run build`
- **Run tests**: `cd editor && npm test`

### Laravel API (_api_app/_ directory)
- **Install dependencies**: `cd _api_app && composer install`
- **Development server**: `cd _api_app && npm run dev` (Vite dev server)
- **Build assets**: `cd _api_app && npm run build`
- **Run tests**: `cd _api_app && ./vendor/bin/pest`
- **Run tests (CI mode)**: `cd _api_app && ./vendor/bin/pest --ci`

## Project Architecture

### Multi-Component CMS System
Berta is a file-based CMS consisting of three main components that work together:

1. **Legacy PHP Engine** (`engine/` directory) - Original Berta CMS core
2. **Angular Editor** (`editor/` directory) - Modern admin interface built with Angular 8
3. **Laravel API** (`_api_app/` directory) - REST API backend using Laravel 12

### Key Architectural Components

#### Frontend Build System (Gulp)
- Compiles SCSS to CSS for multiple templates
- Concatenates and minifies JS/CSS assets
- Builds separate bundles for frontend and backend
- Template-specific SCSS compilation for themes in `_templates/`

#### Template System
- Templates located in `_templates/` directory (default, messy, white, mashup)
- Each template has its own SCSS files that are compiled separately
- Template CSS is built to template-specific directories

#### Angular Editor
- NGXS state management for application state
- Component-based modular architecture with inline templates
- Outputs built files to `../engine/dist/`

#### Laravel API Backend  
- Modern Laravel 12 application
- Pest testing framework
- Vite for asset compilation
- RESTful API structure

### Entry Points
- **Main site**: `index.php` (delegates to `engine/index.php`)
- **Editor interface**: Angular app served from `engine/dist/`  
- **API endpoints**: Laravel routes in `_api_app/routes/`

### Development Workflow
1. **Frontend assets**: Use `npm run dev` in root for CSS/JS compilation with watch
2. **Admin interface**: Use `npm start` in `editor/` for Angular development server
3. **API development**: Use Laravel's built-in server or Vite dev server in `_api_app/`

### File Storage
- Content stored in files (not database) as per CMS design
- Storage directory contains user uploads and content files
