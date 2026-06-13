import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const db = new PrismaClient();

async function exportDatabase() {
  try {
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

    // Write to public folder for static access
    const publicPath = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(publicPath, 'curriculum.json'),
      JSON.stringify(data, null, 2)
    );

    console.log('✅ Database exported to public/data/curriculum.json');
    console.log(`   - Academic Years: ${data.academicYears.length}`);
    console.log(`   - Specializations: ${data.specializations.length}`);
    console.log(`   - Simulators: ${data.simulators.length}`);
    console.log(`   - Badges: ${data.badges.length}`);

    // Calculate totals
    let totalSubjects = 0;
    let totalUnits = 0;
    let totalLessons = 0;

    for (const year of data.academicYears) {
      totalSubjects += year.Subject.length;
      for (const subject of year.Subject) {
        totalUnits += subject.Unit.length;
        for (const unit of subject.Unit) {
          totalLessons += unit.Lesson.length;
        }
      }
    }

    console.log(`   - Total Subjects: ${totalSubjects}`);
    console.log(`   - Total Units: ${totalUnits}`);
    console.log(`   - Total Lessons: ${totalLessons}`);

    await db.$disconnect();
  } catch (error) {
    console.error('⚠️ Export failed:', error);
    await db.$disconnect();
    process.exit(1);
  }
}

exportDatabase();
