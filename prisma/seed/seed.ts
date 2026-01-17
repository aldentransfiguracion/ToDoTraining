import { exitCode } from 'process';
import { prisma } from '../client';
import { deleteSeeds } from './functions/delete';
import { seedUsers } from './functions/seedUsers';
import { defineOptions, SeedArguments } from './types';
import { seedTasks } from './functions/seedTasks';

export const options = defineOptions({
  coolio: {
    type: 'boolean',
    description: 'idk',
    short: 'c',
  },
  thisIsFreakingLong: {
    type: 'string',
    description: 'testing',
    short: 't',
  },
});

export async function seed(args?: SeedArguments) {
  await deleteSeeds();
  // await seedUsers();
  // await seedTasks();

  if (args?.thisIsFreakingLong === 'lol') {
    console.log('Im silly! :P');
    return;
  }
}
