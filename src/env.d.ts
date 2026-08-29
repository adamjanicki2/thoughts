/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "virtual:thoughts" {
  import type { Thought } from "src/types";

  const thoughts: readonly Thought[];

  export { thoughts };
}
