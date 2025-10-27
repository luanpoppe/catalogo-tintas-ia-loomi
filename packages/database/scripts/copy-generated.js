#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const src = path.join(packageRoot, "generated");
const dest = path.join(packageRoot, "dist", "generated");

try {
  if (!fs.existsSync(src)) {
    console.error(`Source directory not found: ${src}`);
    process.exit(0);
  }

  // Remove destination if exists
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
  }

  // Copy recursively (Node 16+ supports cpSync)
  fs.cpSync(src, dest, { recursive: true });

  console.log(`Copied generated Prisma client from ${src} to ${dest}`);
} catch (err) {
  console.error("Failed to copy generated Prisma client:", err);
  process.exit(1);
}
