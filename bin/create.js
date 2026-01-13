#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appName = process.argv[2] || "my-backend";
const targetDir = path.resolve(process.cwd(), appName);
const templateDir = path.resolve(__dirname, "../template");

fs.cpSync(templateDir, targetDir, { recursive: true });

console.log(`\nBackend created successfully: ${appName}`);
console.log(`\nNext steps:`);
console.log(`cd ${appName}`);
console.log(`npm install`);
console.log(`npm run dev\n`);
