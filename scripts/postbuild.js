#!/usr/bin/env node
/**
 * Post-build script for Hostinger deployment
 * Ensures all static files are correctly copied to the standalone directory
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const staticSource = path.join(projectRoot, '.next', 'static');
const publicSource = path.join(projectRoot, 'public');
const staticTarget = path.join(standaloneDir, '.next', 'static');
const publicTarget = path.join(standaloneDir, 'public');

console.log('📁 Post-build: Copying static files to standalone directory...');
console.log(`Project root: ${projectRoot}`);
console.log(`Standalone dir: ${standaloneDir}`);

// Ensure .next directory exists in standalone
if (!fs.existsSync(path.join(standaloneDir, '.next'))) {
  fs.mkdirSync(path.join(standaloneDir, '.next'), { recursive: true });
  console.log('✅ Created .next directory in standalone');
}

// Copy .next/static to standalone/.next/static
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source directory not found: ${src}`);
    return false;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(`✅ Copied: ${src} -> ${dest}`);
  return true;
}

// Copy static files
console.log('\n📦 Copying .next/static...');
copyDirSync(staticSource, staticTarget);

// Copy public files
console.log('\n📦 Copying public...');
copyDirSync(publicSource, publicTarget);

// Copy db folder for SQLite
const dbSource = path.join(projectRoot, 'db');
const dbTarget = path.join(standaloneDir, 'db');
if (fs.existsSync(dbSource)) {
  console.log('\n📦 Copying db...');
  copyDirSync(dbSource, dbTarget);
}

// Copy .env file
const envSource = path.join(projectRoot, '.env');
const envTarget = path.join(standaloneDir, '.env');
if (fs.existsSync(envSource)) {
  fs.copyFileSync(envSource, envTarget);
  console.log('✅ Copied .env file');
}

// Verify the copy
console.log('\n📋 Verification:');
if (fs.existsSync(staticTarget)) {
  const files = fs.readdirSync(staticTarget);
  console.log(`✅ .next/static exists with ${files.length} items: ${files.slice(0, 5).join(', ')}...`);
} else {
  console.error('❌ .next/static NOT found in standalone directory');
}

if (fs.existsSync(publicTarget)) {
  const files = fs.readdirSync(publicTarget);
  console.log(`✅ public exists with ${files.length} items: ${files.slice(0, 5).join(', ')}...`);
} else {
  console.error('❌ public NOT found in standalone directory');
}

console.log('\n✅ Post-build complete!');
