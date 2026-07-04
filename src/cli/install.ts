import { existsSync, mkdirSync, cpSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { homedir } from "os";

type AgentType = "opencode" | "claude";

interface InstallOptions {
  agent?: AgentType;
  path?: string;
}

const AGENT_FOLDERS: Record<AgentType, string> = {
  opencode: ".config/opencode/skills",
  claude: ".claude/skills",
};

function getTargetFolder(agent: AgentType, customPath?: string): string {
  if (customPath) {
    return resolve(customPath);
  }

  const home = homedir();
  const folder = AGENT_FOLDERS[agent];
  return join(home, folder);
}

function getSourceSkills(): string {
  return resolve(__dirname, "../../skills");
}

function copySkills(source: string, target: string): void {
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }

  cpSync(source, target, { recursive: true });
}

function getInstalledSkills(target: string): string[] {
  if (!existsSync(target)) return [];

  const { readdirSync } = require("fs");
  const entries = readdirSync(target, { withFileTypes: true });
  return entries
    .filter((e: any) => e.isDirectory() && !e.name.startsWith("."))
    .map((e: any) => e.name);
}

export function runInstall(options: InstallOptions): void {
  const agent = options.agent || "opencode";
  const target = getTargetFolder(agent, options.path);
  const source = getSourceSkills();

  console.log(`\n🔧 SkillForge Installer\n`);
  console.log(`Target: ${agent}`);
  console.log(`Folder: ${target}\n`);

  // Check source exists
  if (!existsSync(source)) {
    console.error("❌ Skills folder not found. Are you running from the SkillForge directory?");
    process.exit(1);
  }

  // Copy skills
  try {
    copySkills(source, target);

    const installed = getInstalledSkills(target);

    console.log(`✅ Skills installed successfully!\n`);
    console.log(`Installed skills:`);
    for (const skill of installed) {
      console.log(`  • /${skill}`);
    }

    console.log(`\n📌 Next steps:`);
    if (agent === "opencode") {
      console.log(`  1. Restart OpenCode`);
      console.log(`  2. Type / to see available commands`);
    } else if (agent === "claude") {
      console.log(`  1. Restart Claude Code`);
      console.log(`  2. Skills will be available automatically`);
    }
    console.log();
  } catch (err) {
    console.error("❌ Installation failed:", err);
    process.exit(1);
  }
}
