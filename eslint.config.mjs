import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  // Preserve lint behavior for existing effect-driven loaders during the upgrade.
  {
    files: [
      "src/app/*/libros/View.tsx",
      "src/components/portal/PlatformCourses.tsx",
      "src/components/portal/PortalAdministration.tsx",
      "src/components/portal/PortalAttendance.tsx",
      "src/components/ui/carousel.tsx",
      "src/hooks/use-mobile.tsx",
    ],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  {
    files: ["src/components/home/DownloadSection.tsx"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
