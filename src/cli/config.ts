export interface SkillForgeConfig {
  defaultPath: string;
  defaultFormat: "markdown" | "json";
  verbose: boolean;
}

const defaultConfig: SkillForgeConfig = {
  defaultPath: ".",
  defaultFormat: "markdown",
  verbose: false,
};

export function loadConfig(overrides?: Partial<SkillForgeConfig>): SkillForgeConfig {
  return {
    ...defaultConfig,
    ...overrides,
  };
}
