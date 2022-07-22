// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { pokemonRouter } from "./pokemon";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("pokemon.", pokemonRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
