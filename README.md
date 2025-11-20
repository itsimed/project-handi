# Vite + React + TypeScript + TailwindCSS v3 Template

This is a ready-to-clone template for starting new projects instantly. It includes:
- Vite + React + TypeScript
- TailwindCSS v3 (with config file)
- Framer Motion
- React Navigation
- Pre-configured folder structure for components, layouts, UI, theme, hooks, lib, types, constants, data, styles, and assets
- `.gitkeep` files in empty folders to ensure they are tracked by git
- `config` for centralizing colors, assets, themes, and fonts setup

## Folder Structure

- `src/components` – Reusable UI components
- `src/layout` – Layout components (wrappers, page layouts)
- `src/ui` – UI primitives or atomic components
- `src/theme` – Theme-related utilities (can be used for Tailwind or styled-components)
- `src/hooks` – Custom React hooks
- `src/lib` – Utility functions and libraries
- `src/types` – TypeScript type definitions
- `src/constants` – App-wide constants
- `src/data` – Static data or mock data
- `src/styles` – Global or shared styles
- `src/assets` – Static assets (images, SVGs, etc.)
- `src/config` – Centralized configuration for colors, fonts, themes, and assets

## Best Practices

- **Always use config files**: Import colors, fonts, themes, and asset paths from the files in `src/config` instead of hardcoding values. This keeps your design system consistent and easy to update.
- **Always create components**: Build your UI by creating reusable components in `src/components` or `src/ui`. Avoid writing raw JSX or logic directly in pages or the root `App.tsx`—this makes your codebase scalable and maintainable.

## Usage
1. Clone this repo
2. Run `npm install`
3. Start building your app!