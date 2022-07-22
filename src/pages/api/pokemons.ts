// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const pokemons = async (req: NextApiRequest, res: NextApiResponse) => {
  // const pokemons = await prisma.pokemon.findMany();
  // res.status(200).json(pokemons);
};

export default pokemons;
