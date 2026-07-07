import { Command } from "commander";
import { z } from "zod";

const program = new Command();

program
  .name("forge-skills")
  .description("Global AI Skills Ecosystem for code review and audit")
  .version("1.0.0");

// Install command
program
  .command("install")
  .description("Install SkillForge skills to AI agent")
  .option("--opencode", "Install to OpenCode", false)
  .option("--claude", "Install to Claude Code", false)
  .option("--antigravity", "Install to Google Antigravity", false)
  .option("--agy", "Install to Google Antigravity (shortcut)", false)
  .option("--path <path>", "Custom installation path")
  .action(async (opts) => {
    let agent: "opencode" | "claude" | "antigravity" = "opencode";
    if (opts.claude) agent = "claude";
    else if (opts.antigravity || opts.agy) agent = "antigravity";
    const { runInstall } = await import("./install.js");
    runInstall({ agent, path: opts.path });
  });

// Uninstall command
program
  .command("uninstall")
  .description("Uninstall SkillForge skills from AI agent")
  .option("--opencode", "Uninstall from OpenCode", false)
  .option("--claude", "Uninstall from Claude Code", false)
  .option("--antigravity", "Uninstall from Google Antigravity", false)
  .option("--agy", "Uninstall from Google Antigravity (shortcut)", false)
  .option("--path <path>", "Custom installation path")
  .action(async (opts) => {
    let agent: "opencode" | "claude" | "antigravity" = "opencode";
    if (opts.claude) agent = "claude";
    else if (opts.antigravity || opts.agy) agent = "antigravity";
    const { runUninstall } = await import("./install.js");
    runUninstall({ agent, path: opts.path });
  });

// Upgrade command
program
  .command("upgrade")
  .description("Interactive assistant to upgrade installed skills for AI agents")
  .action(async () => {
    const { runUpgrade } = await import("./upgrade.js");
    await runUpgrade();
  });


// Common options schema
const commonOptions = z.object({
  path: z.string().optional().default("."),
  quick: z.boolean().optional().default(false),
  deep: z.boolean().optional().default(false),
  markdown: z.boolean().optional().default(true),
  json: z.boolean().optional().default(false),
  verbose: z.boolean().optional().default(false),
  external: z.boolean().optional().default(false),
  lang: z.string().optional().default("en"),
});

type CommonOptions = z.infer<typeof commonOptions>;

function parseOptions(opts: any): CommonOptions {
  return commonOptions.parse(opts);
}

// Security Audit command
program
  .command("security-audit")
  .description("Security review of source code")
  .argument("[path]", "Target directory", ".")
  .option("--quick", "Fast scan", false)
  .option("--deep", "Thorough scan", false)
  .option("--markdown", "Output as markdown", true)
  .option("--json", "Output as JSON", false)
  .option("--verbose", "Detailed output", false)
  .option("--external", "Run external scanners (npm audit, semgrep)", false)
  .option("--lang <lang>", "Output language locale (en, id)", "en")
  .action(async (path, opts) => {
    const options = parseOptions({ path, ...opts });
    const { runSecurityAudit } = await import("./runner.js");
    await runSecurityAudit(options);
  });

// Bug Investigate command
program
  .command("bug-investigate")
  .description("Investigate bugs automatically")
  .argument("[path]", "Target directory", ".")
  .option("--quick", "Fast scan", false)
  .option("--deep", "Thorough scan", false)
  .option("--markdown", "Output as markdown", true)
  .option("--json", "Output as JSON", false)
  .option("--verbose", "Detailed output", false)
  .option("--lang <lang>", "Output language locale (en, id)", "en")
  .action(async (path, opts) => {
    const options = parseOptions({ path, ...opts });
    const { runBugInvestigate } = await import("./runner.js");
    await runBugInvestigate(options);
  });

// Performance Audit command
program
  .command("performance-audit")
  .description("Audit application performance")
  .argument("[path]", "Target directory", ".")
  .option("--quick", "Fast scan", false)
  .option("--deep", "Thorough scan", false)
  .option("--markdown", "Output as markdown", true)
  .option("--json", "Output as JSON", false)
  .option("--verbose", "Detailed output", false)
  .option("--lang <lang>", "Output language locale (en, id)", "en")
  .action(async (path, opts) => {
    const options = parseOptions({ path, ...opts });
    const { runPerformanceAudit } = await import("./runner.js");
    await runPerformanceAudit(options);
  });

// Architecture Review command
program
  .command("architecture-review")
  .description("Review project architecture")
  .argument("[path]", "Target directory", ".")
  .option("--quick", "Fast scan", false)
  .option("--deep", "Thorough scan", false)
  .option("--markdown", "Output as markdown", true)
  .option("--json", "Output as JSON", false)
  .option("--verbose", "Detailed output", false)
  .option("--lang <lang>", "Output language locale (en, id)", "en")
  .action(async (path, opts) => {
    const options = parseOptions({ path, ...opts });
    const { runArchitectureReview } = await import("./runner.js");
    await runArchitectureReview(options);
  });

// Dependency Review command
program
  .command("dependency-review")
  .description("Review project dependencies")
  .argument("[path]", "Target directory", ".")
  .option("--quick", "Fast scan", false)
  .option("--deep", "Thorough scan", false)
  .option("--markdown", "Output as markdown", true)
  .option("--json", "Output as JSON", false)
  .option("--verbose", "Detailed output", false)
  .option("--external", "Run external scanners (npm audit, semgrep)", false)
  .option("--lang <lang>", "Output language locale (en, id)", "en")
  .action(async (path, opts) => {
    const options = parseOptions({ path, ...opts });
    const { runDependencyReview } = await import("./runner.js");
    await runDependencyReview(options);
  });

// Database Review command
program
  .command("database-review")
  .description("Review database usage")
  .argument("[path]", "Target directory", ".")
  .option("--quick", "Fast scan", false)
  .option("--deep", "Thorough scan", false)
  .option("--markdown", "Output as markdown", true)
  .option("--json", "Output as JSON", false)
  .option("--verbose", "Detailed output", false)
  .option("--lang <lang>", "Output language locale (en, id)", "en")
  .action(async (path, opts) => {
    const options = parseOptions({ path, ...opts });
    const { runDatabaseReview } = await import("./runner.js");
    await runDatabaseReview(options);
  });

// Release Check command
program
  .command("release-check")
  .description("Pre-release checklist")
  .argument("[path]", "Target directory", ".")
  .option("--quick", "Fast scan", false)
  .option("--deep", "Thorough scan", false)
  .option("--markdown", "Output as markdown", true)
  .option("--json", "Output as JSON", false)
  .option("--verbose", "Detailed output", false)
  .option("--lang <lang>", "Output language locale (en, id)", "en")
  .action(async (path, opts) => {
    const options = parseOptions({ path, ...opts });
    const { runReleaseCheck } = await import("./runner.js");
    await runReleaseCheck(options);
  });

program.parse();
