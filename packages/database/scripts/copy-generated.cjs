#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const src = path.join(packageRoot, "generated");
const destSrc = path.join(packageRoot, "../", "api", "src", "generated");
const destDist = path.join(packageRoot, "dist", "generated");

try {
  if (!fs.existsSync(src)) {
    console.error(`Source directory not found: ${src}`);
    process.exit(0);
  }

  // Copy to src/generated (so tsc can compile it into dist)
  if (fs.existsSync(destSrc)) {
    fs.rmSync(destSrc, { recursive: true, force: true });
  } else {
    fs.mkdirSync(path.dirname(destSrc), { recursive: true });
  }
  fs.cpSync(src, destSrc, { recursive: true });
  console.log(`Copied generated Prisma client from ${src} to ${destSrc}`);
} catch (err) {
  console.error("Failed to copy generated Prisma client:", err);
  process.exit(1);
}
