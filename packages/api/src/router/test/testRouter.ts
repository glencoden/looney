import { publicProcedure } from "../..";

export const testRouter = {
  hello: publicProcedure.query(() => {
    return "glen was here";
  }),
};
