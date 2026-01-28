import { prisma } from '../../../prisma/server';

export const seedTasks = async () => {
  await prisma.task.createMany({
    data: [
      //Admin Tasks
      {
        userId: 'admin',
        title: 'Hire New Employees',
        description: 'Create new listing, do interviews, hire',
      },
      {
        userId: 'admin',
        title: 'Make Retiree Policy',
        description: 'Ask Kelli to do it for me',
      },
      //User Tasks
      {
        userId: 'user',
        title: 'Homework',
        description: 'read modules',
      },
      {
        userId: 'user',
        title: 'Buy Textbooks',
        description: 'For math and science class',
      },
    ],
  });
};
