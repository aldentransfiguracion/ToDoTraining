import { faker } from '@faker-js/faker';
import { prisma, Status, Task } from '../client';
import { deleteSeeds } from './functions/delete';
import { seedUsers } from './functions/seedUsers';
import { defineOptions, SeedArguments } from './types';
import { seedTasks } from './functions/seedTasks';

export const options = defineOptions({
  seedRandomTasks: {
    type: 'boolean',
    description: 'mass create dummy tasks',
    short: 't',
  },
});

export async function seed(args?: SeedArguments) {
  await deleteSeeds();
  await seedUsers();
  await seedTasks();

  if (args?.seedRandomTasks) {
    const NUMBER_OF_TASKS = 10;
    const users = await prisma.user.findMany({ select: { id: true } });
    if (users.length === 0) throw new Error('Seed users first.');

    const randomTasks = [];
    for (let i = 0; i < NUMBER_OF_TASKS; i++) {
      const status = faker.helpers.arrayElement(
        Object.values(Status).map(s => s)
      );
      randomTasks.push({
        userId: faker.helpers.arrayElement(users.map(u => u.id)),
        title: faker.lorem.words({ min: 2, max: 6 }),
        description: faker.lorem.sentences({ min: 1, max: 3 }),
        status: status,
        completedDate:
          status === Status.complete ? faker.date.recent({ days: 14 }) : null,
      });
    }
    await prisma.task.createMany({ data: randomTasks });
  }
}
