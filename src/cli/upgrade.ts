import { runInstall } from "./install.js";
import readline from "readline";

interface AgentOption {
  name: string;
  value: "antigravity" | "opencode" | "claude";
}

const AGENTS: AgentOption[] = [
  { name: "Google Antigravity / agy", value: "antigravity" },
  { name: "OpenCode", value: "opencode" },
  { name: "Claude Code", value: "claude" },
];

export async function runUpgrade(): Promise<void> {
  console.log(`\n🔄 ForgeSkills Upgrade Assistant\n`);

  const selectedAgents = await multiSelectPrompt(
    "Select the AI Agents you want to upgrade:",
    AGENTS
  );

  if (selectedAgents.length === 0) {
    console.log("⚠️ No agents selected for upgrade. Exiting.");
    return;
  }

  console.log(`\n🚀 Upgrading ${selectedAgents.length} agent(s)...\n`);

  for (const agent of selectedAgents) {
    try {
      runInstall({ agent });
    } catch (err) {
      console.error(`❌ Failed to upgrade ${agent}:`, err);
    }
  }

  console.log("✨ Upgrade process completed!");
}

function multiSelectPrompt(
  question: string,
  options: AgentOption[]
): Promise<("antigravity" | "opencode" | "claude")[]> {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    const checked = new Set<number>();

    const stdin = process.stdin;
    const stdout = process.stdout;

    // Enable raw mode
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    // Hide cursor
    stdout.write("\x1B[?25l");

    function render() {
      // Clear line and print question
      stdout.write(`\r\x1b[K\x1B[1m${question}\x1B[22m (Space to toggle, Enter to confirm)\n`);
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (!opt) continue;
        const isChecked = checked.has(i) ? "●" : "○";
        const prefix = i === selectedIndex ? `\x1b[36m➔\x1b[39m` : " ";
        const text = i === selectedIndex ? `\x1b[36m${opt.name}\x1b[39m` : opt.name;
        stdout.write(`\r\x1b[K  ${prefix} [${isChecked}] ${text}\n`);
      }
      // Move cursor back up
      stdout.write(`\x1B[${options.length + 1}A`);
    }

    render();

    function cleanup() {
      // Restore cursor
      stdout.write("\x1B[?25h");
      // Move cursor down past the menu
      stdout.write(`\x1B[${options.length + 1}B\r\n`);
      stdin.setRawMode(wasRaw);
      stdin.pause();
    }

    const keyHandler = (key: string) => {
      // Ctrl+C
      if (key === "\u0003") {
        cleanup();
        process.exit(0);
      }
      // Enter / Return
      if (key === "\r" || key === "\n") {
        cleanup();
        stdin.off("data", keyHandler);
        const results = Array.from(checked)
          .map((i) => options[i]?.value)
          .filter((v): v is "antigravity" | "opencode" | "claude" => !!v);
        resolve(results);
        return;
      }
      // Space
      if (key === " ") {
        if (checked.has(selectedIndex)) {
          checked.delete(selectedIndex);
        } else {
          checked.add(selectedIndex);
        }
        render();
      }
      // Up arrow or 'k' or 'w'
      if (key === "\u001b[A" || key === "k" || key === "w") {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
      }
      // Down arrow or 'j' or 's'
      if (key === "\u001b[B" || key === "j" || key === "s") {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
      }
    };

    stdin.on("data", keyHandler);
  });
}
