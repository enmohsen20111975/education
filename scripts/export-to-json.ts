import fs from 'fs';
import path from 'path';

async function exportDatabase() {
  const outputPath = path.join(process.cwd(), 'public', 'data', 'curriculum.json');
  
  // Check if curriculum.json already exists (from git)
  if (fs.existsSync(outputPath)) {
    console.log('✅ curriculum.json already exists, skipping export');
    return;
  }

  // Try to export from database
  try {
    const { PrismaClient } = await import('@prisma/client');
    const db = new PrismaClient();

    console.log('📦 Exporting database to JSON...');

    const data = {
      academicYears: await db.academicYear.findMany({
        orderBy: { order: 'asc' },
        include: {
          Subject: {
            orderBy: { order: 'asc' },
            include: {
              Specialization: true,
              Unit: {
                orderBy: { order: 'asc' },
                include: {
                  Lesson: {
                    orderBy: { order: 'asc' },
                    include: {
                      Objective: { orderBy: { order: 'asc' } },
                      Concept: { orderBy: { order: 'asc' } },
                      Formula: { orderBy: { order: 'asc' } },
                      Example: { orderBy: { order: 'asc' } },
                      Question: { orderBy: { order: 'asc' } },
                    }
                  }
                }
              }
            }
          }
        }
      }),
      specializations: await db.specialization.findMany({ orderBy: { order: 'asc' } }),
      semesters: await db.semester.findMany({ orderBy: { order: 'asc' } }),
      simulators: await db.simulator.findMany(),
      badges: await db.badge.findMany(),
    };

    // Ensure directory exists
    const publicPath = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log('✅ Database exported to public/data/curriculum.json');
    console.log(`   - Academic Years: ${data.academicYears.length}`);
    
    await db.$disconnect();
  } catch (error) {
    console.log('⚠️ No database available, checking for existing curriculum.json...');
    
    if (fs.existsSync(outputPath)) {
      console.log('✅ Using existing curriculum.json from repository');
    } else {
      console.error('❌ No curriculum.json found and no database available');
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
  }
}

exportDatabase();
