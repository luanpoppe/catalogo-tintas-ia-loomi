// import { defineConfig } from "vitest/config";
// import tsConfigPaths from "vite-tsconfig-paths";

// export default defineConfig({
//   plugins: [tsConfigPaths()],
//   test: {
//     environment: "node",
//     server: {
//       deps: {
//         external: [/\/packages\/database\//],
//       },
//     },
//     dir: "./",
//     globals: true,
//     projects: [
//       {
//         // extends: true,
//         test: {
//           name: "unit",
//           dir: "src/",
//           environment: "node",
//         },
//       },
//       {
//         // extends: true,
//         test: {
//           name: "e2e",
//           dir: "test/e2e/",
//           environment:
//             "../database/dist/prisma/vitest-environment-prisma/prisma-test-environment.js",
//         },
//       },
//     ],
//     coverage: {
//       include: ["src/**/*.ts"],
//       exclude: [
//         "src/server.ts",
//         "src/app.ts",
//         "src/env.ts",
//         "src/lib/prisma.ts",
//         "src/domains/**/infrastructure/http/dto/*.ts",
//         "src/domains/**/infrastructure/http/controllers/*.ts",
//         "src/domains/**/infrastructure/http/docs/*.ts",
//         "src/domains/**/domain/entities/*.ts",
//         "src/domains/**/domain/repositories/*.ts",
//         "src/domains/**/infrastructure/repositories/*.repository.ts",
//         "src/lib/langchain/**/*.ts",
//         "src/generated/**",
//       ],
//     },
//   },
// });

import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: ".",
    globals: true,
    environment: "node",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          dir: "test/e2e/",
          environment:
            "../database/prisma/vitest-environment-prisma/prisma-test-environment.ts",
        },
      },
    ],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "src/server.ts",
        "src/app.ts",
        "src/env.ts",
        "src/lib/prisma.ts",
        "src/domains/**/infrastructure/http/dto/*.ts",
        "src/domains/**/infrastructure/http/controllers/*.ts",
        "src/domains/**/infrastructure/http/docs/*.ts",
        "src/domains/**/domain/entities/*.ts",
        "src/domains/**/domain/repositories/*.ts",
        "src/domains/**/infrastructure/repositories/*.repository.ts",
        "src/lib/langchain/**/*.ts",
        "src/generated/**",
      ],
    },
  },
});
