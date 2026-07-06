import { execSync } from "child_process";

export function parseNpmAudit(jsonOutput: string): any[] {
  try {
    const data = JSON.parse(jsonOutput);
    const findings: any[] = [];
    if (data.vulnerabilities) {
      for (const [pkg, info] of Object.entries(data.vulnerabilities) as any) {
        findings.push({
          id: `npm-${pkg}`,
          title: `${pkg} vulnerability (${info.severity})`,
          severity: info.severity === "critical" ? "Critical" : info.severity === "high" ? "High" : "Medium",
          description: `Vulnerable dependency range: ${info.range}. Via: ${info.via.map((v: any) => typeof v === "string" ? v : v.title).join(", ")}`,
          recommendation: `Run: npm update ${pkg} or audit fix`,
          evidence: [{ file: "package.json", line: 1 }]
        });
      }
    }
    return findings;
  } catch {
    return [];
  }
}

export function parseSemgrep(jsonOutput: string): any[] {
  try {
    const data = JSON.parse(jsonOutput);
    const findings: any[] = [];
    if (data.results) {
      for (const result of data.results) {
        findings.push({
          id: `semgrep-${result.check_id}`,
          title: `Semgrep: ${result.check_id}`,
          severity: result.extra.severity === "ERROR" ? "High" : "Medium",
          description: result.extra.message,
          recommendation: "Review the flagged code and apply necessary security sanitization.",
          evidence: [{
            file: result.path,
            line: result.start.line,
            snippet: result.extra.lines
          }]
        });
      }
    }
    return findings;
  } catch {
    return [];
  }
}

export function runNpmAudit(projectPath: string): any[] {
  try {
    const output = execSync("npm audit --json", { cwd: projectPath, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
    return parseNpmAudit(output);
  } catch (err: any) {
    if (err.stdout) {
      return parseNpmAudit(err.stdout.toString());
    }
    // NOTE: console.warn writes to stderr, which prevents it from polluting JSON payloads printed to stdout.
    console.warn("⚠️ Warning: 'npm' command not found or failed to execute. Skipping dependency audit.");
    return [];
  }
}

export function runSemgrep(projectPath: string): any[] {
  try {
    const output = execSync("semgrep --json --config=auto", { cwd: projectPath, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
    return parseSemgrep(output);
  } catch (err: any) {
    if (err.stdout) {
      return parseSemgrep(err.stdout.toString());
    }
    // NOTE: console.warn writes to stderr, which prevents it from polluting JSON payloads printed to stdout.
    console.warn("⚠️ Warning: 'semgrep' command not found or failed to execute. Skipping static code review.");
    return [];
  }
}
