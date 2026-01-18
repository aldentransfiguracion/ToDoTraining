import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { prisma, Status } from '../../../../../prisma/client';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

const getTasksByUserInput = z.object({
  pageSize: z.number(),
  pageOffset: z.number(),
});

const getTasksByUserOutput = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.literal(Object.values(Status)),
      completedDate: z.date().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  count: z.number(),
});

export const getTasksByUser = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(getTasksByUserInput)
  .output(getTasksByUserOutput)
  .mutation(async opts => {
    try {
      const userId = opts.ctx.userId;

      const total = await prisma.task.count({
        where: { userId: userId },
      });

      if (opts.input.pageOffset && opts.input.pageOffset >= total) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot paginate to item ${opts.input.pageOffset + 1}, as there are only ${total} items`,
        });
      }

      const tasks = await prisma.task.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: opts.input.pageSize,
        skip: opts.input.pageOffset,
      });

      return { data: tasks, count: total };
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
