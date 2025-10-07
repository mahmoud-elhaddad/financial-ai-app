# Financial AI

A comprehensive Angular 19 modular application skeleton with exportation capabilities, authentication, and internationalization support.

## 🚀 Technology Stack

- **Angular**: 19.0.0
- **TypeScript**: 5.5.0
- **Package Manager**: pnpm
- **UI Framework**: Angular Material + ng-bootstrap
- **Internationalization**: ngx-translate

## 📋 Prerequisites

- Node.js 18.13.0 or later
- pnpm (recommended package manager)
- Angular CLI 19.0.0

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://gitlab.com/mnagi/financial-ai-front
   cd financial-ai-front
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm start
   ```

4. **Navigate to the application**
   Open your browser and go to `http://localhost:4200/`

## 🎯 Key Features

### 🔐 Authentication System
- Login/Register functionality
- Route guards for protected routes
- Auth interceptors for token management

### 📄 Exportation Capabilities
- **PDF Export**: Generate PDF documents with custom orientation
- **Excel Export**: Create spreadsheets with data formatting
- **DOCX Export**: Generate Word documents
- **Text Export**: Export data as plain text files

### 🌐 Internationalization
- Multi-language support (Arabic/English)
- Dynamic language switching
- Localized content management

## 🚀 Available Scripts

```bash
# Development
pnpm start              # Start development server
pnpm build              # Build for production
pnpm watch              # Build with watch mode

# Testing
pnpm test               # Run unit tests

# Code Generation
ng generate component component-name
ng generate service service-name
ng generate pipe pipe-name
ng generate directive directive-name
```

## 🏗️ Build Configuration

The project uses Angular 19 with the following build optimizations:
- **Bundle Budget**: 2MB warning, 3MB error limit
- **Optimization**: Production builds are optimized
- **Source Maps**: Available in development mode

## 📚 Dependencies


## 🌍 Environment Setup

### Development
```bash
pnpm start
# Navigate to http://localhost:4200
```

### Production Build
```bash
pnpm build
# Output in dist/financial-ai/
```
