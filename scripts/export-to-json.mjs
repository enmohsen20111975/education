import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportDatabase() {
  const outputPath = path.join(process.cwd(), 'public', 'data', 'curriculum.json');
  
  // Check if curriculum.json already exists (from git)
  if (fs.existsSync(outputPath)) {
    console.log('✅ curriculum.json already exists, skipping export');
    return;
  }

  console.log('⚠️ No curriculum.json found in repository');
  
  // Create empty data file to prevent build failure
  const emptyData = {
    academicYears: [],
    specializations: [],
    semesters: [],
    simulators: [],
    badges: []
  };
  
  const publicPath = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(emptyData, null, 2));
  console.log('⚠️ Created empty curriculum.json - website will show no data');
}

exportDatabase();
