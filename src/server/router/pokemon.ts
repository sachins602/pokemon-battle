import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../../server/db/client";
import { getOptionsForVote } from "../../utils/getRandomPokemon";

export const pokemonRouter = createRouter()
  .query("get-pokemon-pair", {
    async resolve() {
      const [first, second] = getOptionsForVote();

      const bothPokemon = await prisma.pokemon.findMany({
        where: { id: { in: [first!, second!] } },
      });

      if (bothPokemon.length !== 2)
        throw new Error("Failed to find two pokemon");

      return { firstPokemon: bothPokemon[0], secondPokemon: bothPokemon[1] };
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });
      return { success: true, vote: voteInDb };
    },
  });

