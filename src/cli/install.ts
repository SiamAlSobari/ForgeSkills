import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, rmSync } from "fs";
import { join, resolve } from "path";
import { homedir } from "os";

type AgentType = "opencode" | "claude" | "antigravity";

interface InstallOptions {
  agent?: AgentType;
  path?: string;
}

const AGENT_FOLDERS: Record<AgentType, string> = {
  opencode: ".config/opencode",
  claude: ".claude",
  antigravity: ".gemini/config",
};

function getTargetBase(agent: AgentType, customPath?: string): string {
  if (customPath) {
    return resolve(customPath);
  }
  return join(homedir(), AGENT_FOLDERS[agent]);
}

function getSourceDir(): string {
  return resolve(__dirname, "../..");
}

function copySkills(source: string, target: string): void {
  const skillsSource = join(source, "skills");
  const skillsTarget = join(target, "skills");

  if (!existsSync(skillsTarget)) {
    mkdirSync(skillsTarget, { recursive: true });
  }

  cpSync(skillsSource, skillsTarget, { recursive: true });
}

const SKILL_COMMANDS: Record<string, string> = {
  "security-audit": "Security review of source code - detect vulnerabilities, secrets, config issues",
  "bug-investigate": "Investigate bugs automatically - error logs, code paths, root cause analysis",
  "performance-audit": "Audit application performance - queries, memory, algorithms, caching",
  "architecture-review": "Review project architecture - patterns, separation, modularity, SOLID",
  "dependency-review": "Review dependencies - outdated, unused, licenses, supply chain risks",
  "database-review": "Review database usage - queries, indexing, schema, migrations",
  "release-check": "Pre-release checklist - changelog, version, CI/CD, breaking changes",
  "ai-audit": "Review AI/LLM integrations - client configurations, prompt quality, and fallback safety",
};

function getInstalledItems(target: string): string[] {
  if (!existsSync(target)) return [];
  return readdirSync(target, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
}

function rewriteToColon(target: string, skills: string[]): void {
  for (const skill of skills) {
    const skillMdPath = join(target, "skills", skill, "SKILL.md");
    if (existsSync(skillMdPath)) {
      let content = readFileSync(skillMdPath, "utf8");
      
      content = content.replace(/name:\s*forge-([a-z0-9-]+)/g, "name: forge:$1");
      content = content.replace(/Trigger when user types \/forge-([a-z0-9-]+)/g, "Trigger when user types /forge:$1");
      content = content.replace(/# \/forge-([a-z0-9-]+)/g, "# /forge:$1");
      content = content.replace(/\/forge-([a-z0-9-]+)/g, "/forge:$1");

      writeFileSync(skillMdPath, content, "utf8");
    }
  }
}

export function runInstall(options: InstallOptions): void {
  const agent = options.agent || "opencode";
  const targetBase = getTargetBase(agent, options.path);
  const source = getSourceDir();

  console.log(`\n🔧 ForgeSkills Installer\n`);
  console.log(`Target: ${agent}`);
  console.log(`Folder: ${targetBase}\n`);

  if (!existsSync(source)) {
    console.error("❌ Skills folder not found. Are you running from the ForgeSkills directory?");
    process.exit(1);
  }

  try {
    // Copy skills
    copySkills(source, targetBase);

    const installed = getInstalledItems(join(targetBase, "skills")).filter(skill =>
      Object.keys(SKILL_COMMANDS).includes(skill)
    );

    // Rewrite to colon in target installation path (hybrid solution)
    rewriteToColon(targetBase, installed);

    console.log(`✅ Skills installed successfully!\n`);
    console.log(`Installed skills:`);
    for (const skill of installed) {
      console.log(`  • /forge:${skill}`);
    }

    console.log(`\n📌 Next steps:`);
    if (agent === "opencode") {
      console.log(`  1. Restart OpenCode`);
      console.log(`  2. Type / to see available commands`);
    } else if (agent === "claude") {
      console.log(`  1. Restart Claude Code`);
      console.log(`  2. Skills will be available automatically`);
    } else if (agent === "antigravity") {
      console.log(`  1. Restart Antigravity`);
      console.log(`  2. Skills will be available automatically`);
    }
    console.log();
  } catch (err) {
    console.error("❌ Installation failed:", err);
    process.exit(1);
  }
}

export function runUninstall(options: InstallOptions): void {
  const agent = options.agent || "opencode";
  const targetBase = getTargetBase(agent, options.path);

  console.log(`\n🧹 ForgeSkills Uninstaller\n`);
  console.log(`Target: ${agent}`);
  console.log(`Folder: ${targetBase}\n`);

  try {
    const skills = Object.keys(SKILL_COMMANDS);
    let removedSkillsCount = 0;
    let removedCommandsCount = 0;

    for (const skill of skills) {
      // Remove from skills/ folder
      const skillPath = join(targetBase, "skills", skill);
      if (existsSync(skillPath)) {
        rmSync(skillPath, { recursive: true, force: true });
        removedSkillsCount++;
      }

      // Remove from commands/ folder (for OpenCode)
      if (agent === "opencode") {
        const commandPath = join(targetBase, "commands", `${skill}.md`);
        if (existsSync(commandPath)) {
          rmSync(commandPath, { force: true });
          removedCommandsCount++;
        }
      }
    }

    console.log(`✅ Uninstallation completed successfully!`);
    console.log(`  • Removed ${removedSkillsCount} skill directories`);
    if (agent === "opencode") {
      console.log(`  • Removed ${removedCommandsCount} command files`);
    }

    console.log(`\n📌 Next steps:`);
    console.log(`  1. Restart ${agent === "opencode" ? "OpenCode" : agent === "claude" ? "Claude Code" : "Antigravity"} to apply changes`);
    console.log();
  } catch (err) {
    console.error("❌ Uninstallation failed:", err);
    process.exit(1);
  }
}
