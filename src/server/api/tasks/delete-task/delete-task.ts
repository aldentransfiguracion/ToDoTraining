import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma } from '../../../../../prisma/client';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

const deleteTaskInput = z.object({
  taskId: z.string(),
});

const deleteTaskOutput = z.void();

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async opts => {
    try {
      await prisma.task.delete({
        where: {
          id: opts.input.taskId,
          userId: opts.ctx.userId,
        },
      });
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
