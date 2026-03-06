import plugin from "tailwindcss/plugin";
import type { FluidWindOptions } from "./types";

export default plugin.withOptions(
  (_options: FluidWindOptions = {}) =>
    (_helpers) => {
      // Implementation will be added module by module per PLAN.md
    },
);
