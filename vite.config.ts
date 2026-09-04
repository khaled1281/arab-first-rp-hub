// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * Obfuscates the client JavaScript bundles in production builds so the shipped
 * code is unreadable in DevTools. Dev mode and the SSR/server bundles are
 * untouched (obfuscating them would break the worker runtime).
 */
function obfuscateClientBundle(): Plugin {
  return {
    name: "af-obfuscate-client",
    apply: "build",
    enforce: "post",
    async renderChunk(code, chunk, _opts, meta) {
      // Only the browser build; skip SSR/server output.
      // @ts-expect-error environment is available in Vite 6/7 plugin context
      const envName: string | undefined = this.environment?.name;
      if (envName && envName !== "client") return null;
      if (!chunk.fileName.endsWith(".js")) return null;
      void meta;

      const { default: obfuscator } = await import("javascript-obfuscator");
      const result = obfuscator.obfuscate(code, {
        compact: true,
        sourceMap: false,
        target: "browser",
        identifierNamesGenerator: "hexadecimal",
        renameGlobals: false,
        stringArray: true,
        stringArrayThreshold: 0.75,
        stringArrayEncoding: ["base64"],
        stringArrayCallsTransform: false,
        splitStrings: false,
        selfDefending: false,
        debugProtection: false,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        numbersToExpressions: false,
        simplify: true,
        unicodeEscapeSequence: false,
      });

      return { code: result.getObfuscatedCode(), map: null };
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [obfuscateClientBundle()],
    build: {
      // No source maps in production: DevTools shows only minified bundles,
      // never the original src/ files.
      sourcemap: false,
      minify: true,
    },
  },
});
