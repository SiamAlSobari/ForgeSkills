# Framework Detection Prompt

You are identifying frameworks and libraries used in a project.

## Detection Methods

### 1. Package Manager Files

**package.json (Node.js):**
```json
{
  "dependencies": {
    "express": "^4.18.0",     // → Express
    "next": "^14.0.0",        // → Next.js
    "react": "^18.0.0",       // → React
    "vue": "^3.0.0",          // → Vue
    "@nestjs/core": "^10.0.0" // → NestJS
  }
}
```

**go.mod (Go):**
```
require (
    github.com/gin-gonic/gin v1.9.0    // → Gin
    github.com/gofiber/fiber/v2 v2.50.0 // → Fiber
)
```

**requirements.txt / pyproject.toml (Python):**
```
Django>=4.0      // → Django
flask>=3.0       // → Flask
fastapi>=0.100   // → FastAPI
```

**pom.xml / build.gradle (Java):**
- `spring-boot-starter` → Spring Boot

**pubspec.yaml (Dart):**
- `flutter` → Flutter

### 2. Configuration Files

| File | Framework |
|------|-----------|
| `next.config.js` | Next.js |
| `nuxt.config.ts` | Nuxt |
| `angular.json` | Angular |
| `vue.config.js` | Vue |
| `svelte.config.js` | Svelte |
| `astro.config.mjs` | Astro |
| `vite.config.ts` | Vite |

### 3. Framework Categories

**Backend:**
- Express, Fastify, NestJS, Koa, Hapi (Node.js)
- Gin, Fiber, Echo (Go)
- Spring Boot (Java)
- Laravel (PHP)
- Django, Flask, FastAPI (Python)

**Frontend:**
- React, Next.js
- Vue, Nuxt
- Angular
- Svelte, SvelteKit
- Astro

**Mobile:**
- Flutter
- React Native, Expo

### 4. Output Format

```
Frameworks Detected:
  Backend: Express v4.18.0
  Frontend: React v18.2.0, Next.js v14.0.0
  Mobile: None
```

## Notes

- Detect version from dependency string
- Check both dependencies and devDependencies
- Framework detection determines which security patterns to check
