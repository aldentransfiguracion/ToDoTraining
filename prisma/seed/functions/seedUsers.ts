import { prisma } from '../../client';

export const seedUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
        accountType: 'Employee',
        firstName: 'Laura',
        lastName: 'Stevens',
        netId: 'lauraSt',
        id: 'admin',
        preferredFirstName: 'Laura',
        preferredLastName: 'Stevens',
        roles: ['admin', 'user'],
      },
      {
        accountType: 'Student',
        firstName: 'Billy',
        lastName: 'Binglehopper',
        netId: 'billyBoy123',
        id: 'user',
        preferredFirstName: 'Bill',
        preferredLastName: 'Binglehopper',
        roles: ['user'],
      },
    ],
  });
};
