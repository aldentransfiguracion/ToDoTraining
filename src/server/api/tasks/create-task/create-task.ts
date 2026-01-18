import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma } from '../../../../../prisma/client';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

const createTaskInput = z.object({
  title: z.string(),
  description: z.string(),
});

const createTaskOutput = z.object({
  taskId: z.string(),
});

export const createTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(createTaskInput)
  .output(createTaskOutput)
  .mutation(async opts => {
    try {
      const task = await prisma.task.create({
        data: {
          title: opts.input.title,
          description: opts.input.description,
          userId: opts.ctx.userId,
        },
      });

      return { taskId: task.id };
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
