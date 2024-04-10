import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const noteRouter = createTRPCRouter({
  createNote: publicProcedure
    .input(z.object({ title: z.string().min(1), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.note.create({
        data: input,
      });
    }),

  getLatestNote: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.note.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  updateNote: publicProcedure
    .input(
      z.object({
        id: z.number().positive(),
        title: z.string().min(1),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.note.update({
        where: { id: input.id },
        data: { title: input.title, content: input.content },
      });
    }),

  deleteNote: publicProcedure
    .input(z.object({ id: z.number().positive() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.note.delete({
        where: { id: input.id },
      });
    }),

  getNote: publicProcedure
    .input(z.object({ id: z.number().positive() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.note.findUnique({
        where: { id: input.id },
      });
    }),
});
