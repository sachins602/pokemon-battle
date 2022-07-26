import type React from 'react'
import { inferQueryResponse } from '../pages/api/trpc/[trpc]'

import { trpc } from '../utils/trpc'
import { usePlausible } from "next-plausible"
import Link from 'next/link'
import Image from "next/image";
import { useState } from 'react'

export const StageArea = () => {

    const {
        data: pokemonPair,
        refetch,
        isLoading,
    } = trpc.useQuery(["pokemon.get-pokemon-pair"], {
        refetchInterval: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const [point, setPoint] = useState(0);

    const voteMutation = trpc.useMutation(["pokemon.cast-vote"]);
    const plausible = usePlausible();

    const voteForPowerful = (selected: number) => {
        if (!pokemonPair) return;
        //if selected pokemon has more attack add point otherwise remove point
        if (selected === pokemonPair?.firstPokemon!.id) {

            voteMutation.mutate({
                votedFor: pokemonPair.firstPokemon.id,
                votedAgainst: pokemonPair.secondPokemon!.id,
            });

            if (pokemonPair.firstPokemon.attack! > pokemonPair.secondPokemon!.attack!) {
                setPoint(point + 1)
            }
            else if (pokemonPair.firstPokemon.attack! < pokemonPair.secondPokemon!.attack!) {
                setPoint(0)
            }
            else {
                setPoint(point)
            }
        }
        else {
            voteMutation.mutate({
                votedFor: pokemonPair.secondPokemon!.id,
                votedAgainst: pokemonPair.firstPokemon!.id,
            });
            if (pokemonPair.secondPokemon!.attack! > pokemonPair.firstPokemon!.attack!) {
                setPoint(point + 1)
            }
            else if (pokemonPair.secondPokemon!.attack! < pokemonPair.firstPokemon!.attack!) {
                setPoint(0)
            }
            else {
                setPoint(point)
            }
        }

        plausible("cast-vote");
        refetch();
    }
    const fetchingNext = voteMutation.isLoading || isLoading;

    return (
        <div>
            <div className='text-2xl text-center'>
                Which Pokemon Is Stronger?
            </div>
            <div className='text-4xl text-blue-500 ml-72'>{point}</div>
            <div className='p-2' />
            {pokemonPair && (
                <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
                    <PokemonListing
                        pokemon={pokemonPair.firstPokemon}
                        vote={() => voteForPowerful(pokemonPair.firstPokemon!.id)}
                        disabled={fetchingNext}
                    />
                    <div className="p-8 italic text-xl">{"or"}</div>
                    <PokemonListing
                        pokemon={pokemonPair.secondPokemon}
                        vote={() => voteForPowerful(pokemonPair.secondPokemon!.id)}
                        disabled={fetchingNext}
                    />
                    <div className="p-2" />
                </div>
            )}
            {!pokemonPair && <img src="/rings.svg" className="w-72" />}
            <div className="w-full text-xl text-center pb-2">
                <span className="p-4">{"-"}</span>
                <Link href="/results">
                    <a>Results</a>
                </Link>
                <span className="p-4">{"-"}</span>
                <Link href="/about">
                    <a>About</a>
                </Link>
            </div>
        </div >
    )
}

type PokemonFromServer = inferQueryResponse<"pokemon.get-pokemon-pair">["firstPokemon"];

const PokemonListing: React.FC<{
    pokemon: PokemonFromServer;
    vote: () => void;
    disabled: boolean;
}> = (props) => {
    console.log("logged:  ", props.pokemon?.spriteUrl)
    return (
        <div
            className={`flex flex-col items-center transition-opacity ${props.disabled && "opacity-0"
                }`}
            key={props.pokemon?.id}
        >
            <div className="text-xl text-center capitalize mt-[-0.5rem]">
                {props.pokemon?.name}
            </div>
            <img
                src={props.pokemon?.spriteUrl}
                className="w-72 h-72 animate-fade-in"
                alt={props.pokemon?.name}
            />
            {/* <Image
                src={props.pokemon!.spriteUrl}
                width={256}
                height={256}
                layout="fixed"
                className="animate-fade-in"
            /> */}
            <button
                className={btn}
                onClick={() => props.vote()}
                disabled={props.disabled}
            >
                Attack
            </button>
        </div>
    );
};

const btn =
    "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
