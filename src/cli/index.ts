import { Command } from "commander";

const program = new Command();

program
  .name("skillforge")
  .description("Global AI Skills Ecosystem for code review and audit")
  .version("0.1.0");

program.parse();
