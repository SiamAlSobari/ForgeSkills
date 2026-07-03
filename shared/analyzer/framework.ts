export interface FrameworkInfo {
  name: string;
  version: string | null;
  type: "backend" | "frontend" | "mobile" | "fullstack" | "unknown";
}

interface DetectionRule {
  name: string;
  type: FrameworkInfo["type"];
  configFiles?: string[];
  dependencies?: string[];
}

const RULES: DetectionRule[] = [
  // Backend
  { name: "Express", type: "backend", dependencies: ["express"] },
  { name: "Fastify", type: "backend", dependencies: ["fastify"] },
  { name: "NestJS", type: "backend", dependencies: ["@nestjs/core"] },
  { name: "Koa", type: "backend", dependencies: ["koa"] },
  { name: "Hapi", type: "backend", dependencies: ["@hapi/hapi"] },
  { name: "Gin", type: "backend", configFiles: ["go.mod"], dependencies: ["github.com/gin-gonic/gin"] },
  { name: "Fiber", type: "backend", configFiles: ["go.mod"], dependencies: ["github.com/gofiber/fiber"] },
  { name: "Echo", type: "backend", configFiles: ["go.mod"], dependencies: ["github.com/labstack/echo"] },
  { name: "Spring Boot", type: "backend", configFiles: ["pom.xml", "build.gradle"], dependencies: ["spring-boot"] },
  { name: "Laravel", type: "backend", configFiles: ["composer.json"], dependencies: ["laravel/framework"] },
  { name: "Django", type: "backend", configFiles: ["requirements.txt", "pyproject.toml"], dependencies: ["Django"] },
  { name: "Flask", type: "backend", configFiles: ["requirements.txt", "pyproject.toml"], dependencies: ["Flask"] },
  { name: "FastAPI", type: "backend", configFiles: ["requirements.txt", "pyproject.toml"], dependencies: ["fastapi"] },

  // Frontend
  { name: "React", type: "frontend", dependencies: ["react"] },
  { name: "Next.js", type: "frontend", dependencies: ["next"] },
  { name: "Vue", type: "frontend", dependencies: ["vue"] },
  { name: "Nuxt", type: "frontend", dependencies: ["nuxt"] },
  { name: "Angular", type: "frontend", dependencies: ["@angular/core"] },
  { name: "Svelte", type: "frontend", dependencies: ["svelte"] },
  { name: "SvelteKit", type: "frontend", dependencies: ["@sveltejs/kit"] },
  { name: "Astro", type: "frontend", dependencies: ["astro"] },

  // Mobile
  { name: "Flutter", type: "mobile", configFiles: ["pubspec.yaml"], dependencies: ["flutter"] },
  { name: "React Native", type: "mobile", dependencies: ["react-native"] },
  { name: "Expo", type: "mobile", dependencies: ["expo"] },
];

export async function detectFrameworks(root: string): Promise<FrameworkInfo[]> {
  const { readFileSync, existsSync } = await import("fs");
  const path = await import("path");

  const frameworks: FrameworkInfo[] = [];

  for (const rule of RULES) {
    let detected = false;
    let version: string | null = null;

    // Check config files
    if (rule.configFiles) {
      for (const configFile of rule.configFiles) {
        if (existsSync(path.join(root, configFile))) {
          detected = true;
          break;
        }
      }
    }

    // Check dependencies in package.json
    if (rule.dependencies) {
      const pkgPath = path.join(root, "package.json");
      if (existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
          const allDeps = {
            ...pkg.dependencies,
            ...pkg.devDependencies,
            ...pkg.peerDependencies,
          };

          for (const dep of rule.dependencies) {
            if (dep in allDeps) {
              detected = true;
              version = allDeps[dep] ?? null;
              break;
            }
          }
        } catch {
          // ignore parse errors
        }
      }

      // Check go.mod
      const goModPath = path.join(root, "go.mod");
      if (existsSync(goModPath)) {
        try {
          const content = readFileSync(goModPath, "utf-8");
          for (const dep of rule.dependencies) {
            if (content.includes(dep)) {
              detected = true;
              break;
            }
          }
        } catch {
          // ignore
        }
      }

      // Check requirements.txt / pyproject.toml
      for (const reqFile of ["requirements.txt", "pyproject.toml"]) {
        const reqPath = path.join(root, reqFile);
        if (existsSync(reqPath)) {
          try {
            const content = readFileSync(reqPath, "utf-8").toLowerCase();
            for (const dep of rule.dependencies) {
              if (content.includes(dep.toLowerCase())) {
                detected = true;
                break;
              }
            }
          } catch {
            // ignore
          }
        }
      }
    }

    if (detected) {
      frameworks.push({ name: rule.name, version, type: rule.type });
    }
  }

  return frameworks;
}
