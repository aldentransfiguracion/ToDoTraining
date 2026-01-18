import { z } from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma, Status } from '../../../../../prisma/client';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

const updateTaskInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(Status).optional(),
});

const updateTaskOutput = z.object({
  userId: z.string(),
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(Status),
  completedDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(updateTaskInput)
  .output(updateTaskOutput)
  .mutation(async ({ input, ctx }) => {
    try {
      const oldTask = await prisma.task.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.userId },
        select: { status: true },
      });

      let completedDate = undefined;
      if (
        input.status === Status.complete &&
        oldTask.status !== Status.complete
      ) {
        completedDate = new Date();
      }
      if (
        input.status !== undefined &&
        input.status !== Status.complete &&
        oldTask.status === Status.complete
      ) {
        completedDate = null;
      }

      const task = await prisma.task.update({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          completedDate: completedDate,
        },
      });

      return task;
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
