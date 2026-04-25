import prisma from '../src/lib/prisma';

async function main() {
  console.log('Seeding database...');
  
  // 1. Seed Levels
  const levels = [
    { id: 'L1', name: 'Linux Novice', description: 'Beginner basics', order: 1, isFree: true },
    { id: 'L2', name: 'File Master', description: 'Permissions and owners', order: 2, isFree: false },
    { id: 'L3', name: 'SysAdmin Pro', description: 'System management', order: 3, isFree: false },
    { id: 'L4', name: 'Network Architect', description: 'Networking and security', order: 4, isFree: false },
    { id: 'L5', name: 'Kernel Hacker', description: 'Deep internals', order: 5, isFree: false },
  ];

  for (const level of levels) {
    await prisma.level.upsert({
      where: { id: level.id },
      update: level,
      create: level,
    });
  }

  // 2. Seed Lessons
  const lessons = [
    { 
      id: 'l1', 
      levelId: 'L1',
      title: 'The Linux Ecosystem', 
      type: 'video', 
      videoUrl: 'https://www.youtube.com/embed/v_U6Vxz2VpA',
      markdownContent: 'Intro to linux',
      duration: 5,
      order: 1 
    },
    { 
      id: 'l2', 
      levelId: 'L1',
      title: 'Navigating the Filesystem', 
      type: 'text', 
      markdownContent: `## Terminal Navigation\n\nThe filesystem in Linux is a tree structure starting at the root \`/\`.`, 
      duration: 8,
      order: 2 
    },
    { 
      id: 'l3', 
      levelId: 'L1',
      title: 'File Permissions Deep Dive', 
      type: 'lab', 
      markdownContent: 'Interactive session focusing on chmod and chown.', 
      duration: 10,
      order: 3
    }
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: lesson,
      create: lesson
    });
  }

  // 3. Seed Admin User
  await prisma.user.upsert({
    where: { email: 'ismail.elouali.24@ump.ac.ma' },
    update: { role: 'admin' },
    create: {
      id: 'admin_1',
      email: 'ismail.elouali.24@ump.ac.ma',
      name: 'Ismail Admin',
      role: 'admin',
      avatarInitials: 'IA'
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
