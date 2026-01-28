import { prisma } from '../../../prisma/server';

export const deleteSeeds = async () => {
  await prisma.task.deleteMany();
  await prisma.jwtBlacklist.deleteMany();
  await prisma.user.deleteMany();
};
