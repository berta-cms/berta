# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Berta is a file-based CMS (no database required for content storage). It has three distinct sub-applications that are developed and built independently:

1. **`_api_app/`** — Laravel 12 API backend (PHP 8.2+)
2. **`editor/`** — Angular 20 admin editor (TypeScript)
3. **`engine/`** — Legacy PHP rendering engine with Gulp-built assets

## Development Commands

### Laravel API (`_api_app/`)
```bash
cd _api_app
composer install
php artisan test --compact                        # Run all tests
php artisan test --compact --filter=TestName      # Run specific test
vendor/bin/pint --dirty                           # Format changed PHP files
npm run dev                                       # Vite dev server
npm run build                                     # Build assets
```

### Angular Editor (`editor/`)
```bash
cd editor
npm install
npm run dev       # Watch mode (outputs to engine/dist)
npm run build     # Production build (outputs to engine/dist)
npm test          # Karma/Jasmine unit tests
```

### Legacy Engine Assets (root)
```bash
npm install
npm run dev       # Gulp watch (compiles Sass for themes/templates)
npm run build     # Gulp production build
```

## Architecture

### How the Parts Connect

- The **Angular editor** (`editor/`) compiles into `engine/dist/` — the legacy PHP engine serves these compiled assets to the browser.
- The **Laravel API** (`_api_app/`) exposes REST endpoints consumed by the Angular editor for CMS operations (site settings, sections, media, shop).
- The **legacy PHP engine** (`engine/`) handles frontend rendering of sites using file-based XML storage. It reads `.xml` files directly from the user's site directory.
- The Angular editor's **Twig templates** are bundled at build time via `editor/copy-twig-templates.mjs` and `editor/bundle-twig-templates.js` (prebuild step), then rendered client-side using the `twig` npm package.

### Key Directories

| Path | Purpose |
|------|---------|
| `_api_app/app/Sites/` | Site/section/entry management domain |
| `_api_app/app/Shop/` | E-commerce plugin |
| `_api_app/app/Plugins/` | Plugin system |
| `_api_app/app/Configuration/` | App configuration classes |
| `editor/src/` | Angular source (components, state, services) |
| `engine/_classes/` | Legacy PHP classes for site rendering |
| `engine/_lib/berta/` | CSS/JS assets bundled by Gulp |
| `_themes/` | Site themes (capetown, jaipur, kyoto, madrid, etc.) |
| `_templates/` | Email/system templates with SCSS |
| `_plugin_shop/` | Shop plugin PHP files |

### State Management (Angular)

The editor uses **NGXS** for state management. State files live in `editor/src/app/**/state/` alongside their actions.

### Authentication

Laravel Sanctum handles API auth. JWT tokens (Firebase JWT) are used for certain operations.

## Laravel API Guidelines

See `_api_app/CLAUDE.md` for detailed Laravel/PHP conventions, Pest testing rules, and Laravel Boost MCP tool usage. Those guidelines apply whenever working inside `_api_app/`.
