#!/usr/bin/env node
// Cross-platform wrapper to set VITE_SSR_BUILD=1 and run the Vite SSR build.
// Avoids depending on cross-env.
import { spawn } from "node:child_process";

const proc = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vite", "build"],
  {
    env: { ...process.env, VITE_SSR_BUILD: "1" },
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);
proc.on("exit", (code) => process.exit(code ?? 1));
