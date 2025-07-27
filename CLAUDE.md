# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Camera Mobile App built with Next.js 15, React 18, and TypeScript. The application is a Korean-language camera app that provides photography tips through video tutorials and real-time camera functionality for mobile devices.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Runtime**: React 18 with client-side components for camera functionality
- **Build Tool**: Next.js built-in bundler with experimental appDir enabled

## Development Commands

```bash
# Development server (starts on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Project Architecture

### Application Structure
The app follows Next.js 15 App Router structure with a mobile-first design:

- `/src/app/` - App Router pages and layout
  - `layout.tsx` - Root layout with Korean locale (`lang="ko"`) and Inter font
  - `page.tsx` - Main page with camera and tutorial integration
  - `globals.css` - Global styles with dark mode CSS variables

- `/src/components/` - Reusable React components
  - `Camera.tsx` - Camera component with getUserMedia API
  - `VideoTutorials.tsx` - Tutorial video gallery with filtering

### Key Features & Architecture

1. **Camera Functionality** (`Camera.tsx`)
   - Uses `navigator.mediaDevices.getUserMedia()` with rear camera preference (`facingMode: 'environment'`)
   - Captures photos via HTML5 Canvas API
   - Ideal resolution: 1280x720
   - Includes proper cleanup of media streams
   - Error handling for camera permission issues

2. **Photo Management** (`page.tsx`)
   - State management for captured photos and tutorial visibility
   - Automatic photo download with timestamp naming (`photo-${Date.now()}.jpg`)
   - Photo retake functionality
   - Mobile-optimized UI with max-width container

3. **Video Tutorials** (`VideoTutorials.tsx`)
   - Theme-based filtering system with 5 categories (인물사진, 풍경사진, 음식사진, 스트리트, 매크로)
   - Modal-based video player (placeholder implementation for YouTube embeds)
   - References "Jordi Koalitic" as tutorial content creator
   - Responsive grid layout with scroll handling

### Configuration Notes

- **TypeScript**: Uses path mapping (`@/*` → `./src/*`) for clean imports
- **Next.js**: Experimental App Router enabled in `next.config.js`
- **Tailwind**: Configured for `src/` directory with custom gradient utilities
- **Mobile Focus**: All components designed for mobile viewport with responsive breakpoints

### State Management Patterns

The app uses React's built-in state management:
- `useState` for local component state (photo capture, tutorial filtering, UI toggles)
- Prop drilling for parent-child communication (camera → main page)
- No external state management library required for current scope

### Styling Approach

- **Primary**: Tailwind CSS utility classes
- **Theme**: CSS custom properties in `globals.css` with dark mode support
- **Components**: Inline Tailwind classes with hover/focus states
- **Layout**: Mobile-first responsive design with `max-w-md mx-auto` pattern

### Korean Localization

The app is built for Korean users:
- HTML lang attribute set to "ko"
- All UI text in Korean
- Korean typography considerations with Inter font
- Tutorial content references Korean photography education