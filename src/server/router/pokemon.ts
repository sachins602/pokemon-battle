import { createRouter } from "./context";
import { z } from "zod";

import { PokemonClient } from 'pokenode-ts';

export const pokemonRouter = createRouter()
  .query("get-pokemon-by-id", {
    input: z
      .object({
        id: z.number(),
      }),
    async resolve({ input }) {
      const api = new PokemonClient();
      const pokemon = await api.getPokemonById(input!.id!).catch(err => { throw err; });
      return {name: pokemon.name, sprites: pokemon.sprites.other.dream_world.front_default, attack: pokemon.stats[1]?.base_stat};
    },
  }).mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma?.vote.create({
        data: {
          ...input
        }
      })
      return {
        success: true,
        vote: voteInDb
      };
    }
  })

