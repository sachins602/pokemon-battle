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
    const [open, setOpen] = useState(false);

    // const voteMutation = trpc.useMutation(["pokemon.cast-vote"]);
    const plausible = usePlausible();

    const voteForPowerful = (selected: number) => {
        if (!pokemonPair) return;
        //if selected pokemon has more attack add point otherwise remove point
        if (selected === pokemonPair?.firstPokemon!.id) {

            // voteMutation.mutate({
            //     votedFor: pokemonPair.firstPokemon.id,
            //     votedAgainst: pokemonPair.secondPokemon!.id,
            // });

            if (pokemonPair.firstPokemon.attack! > pokemonPair.secondPokemon!.attack!) {
                setPoint(point + 1)
            }
            else if (pokemonPair.firstPokemon.attack! < pokemonPair.secondPokemon!.attack!) {
                setOpen(true)

            }
            else {
                setPoint(point)
            }
        }
        else {
            // voteMutation.mutate({
            //     votedFor: pokemonPair.secondPokemon!.id,
            //     votedAgainst: pokemonPair.firstPokemon!.id,
            // });
            if (pokemonPair.secondPokemon!.attack! > pokemonPair.firstPokemon!.attack!) {
                setPoint(point + 1)
            }
            else if (pokemonPair.secondPokemon!.attack! < pokemonPair.firstPokemon!.attack!) {
                setOpen(true)
            }
            else {
                setPoint(point)
            }
        }

        // plausible("cast-vote");
        refetch();
    }
    // const fetchingNext = voteMutation.isLoading || isLoading;

    return (
        <div>
            <div className='text-2xl text-center'>
                Which Pokemon Is Stronger?
            </div>
            <div className='text-4xl text-blue-500 ml-72'>{point}</div>
            <dialog open={open} className=" mt-40">
                <div className=" opacity-90 fixed inset-0 z-50">

                    <div className="flex h-screen justify-center items-center ">

                        <div className="flex-col justify-center  bg-white py-12 px-24 border-4 border-sky-500 rounded-xl ">

                            <div className="flex  text-lg  text-zinc-600   mb-10" >Your Score: {point}</div>
                            <button
                                className={replayBtn}
                                onClick={() => {
                                    setPoint(0)
                                    setOpen(false)
                                }}
                            >
                                Replay
                            </button>
                        </div>
                    </div>
                </div>

            </dialog>
            <div className='p-2' />
            {pokemonPair && (
                <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
                    <PokemonListing
                        pokemon={pokemonPair.firstPokemon}
                        vote={() => voteForPowerful(pokemonPair.firstPokemon!.id)}
                    // disabled={fetchingNext}
                    />
                    <div className="p-8 italic text-xl">{"or"}</div>
                    <PokemonListing
                        pokemon={pokemonPair.secondPokemon}
                        vote={() => voteForPowerful(pokemonPair.secondPokemon!.id)}
                    // disabled={fetchingNext}
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
    //disabled: boolean;
}> = (props) => {
    console.log("logged:  ", props.pokemon?.spriteUrl)
    return (
        <div
            className={`flex flex-col items-center transition-opacity`}
            key={props.pokemon?.id}
        >
            <div className="text-xl text-center capitalize mt-[-0.5rem]">
                {props.pokemon?.name}
            </div>
            <Image
                src={props.pokemon!.spriteUrl}
                width={256}
                height={256}
                layout="fixed"
                className="animate-fade-in"
            />
            <button
                className={btn}
                onClick={() => props.vote()}
            // disabled={props.disabled}
            >
                Attack
            </button>
        </div>
    );
};

const btn =
    "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";


const replayBtn =
    "rounded px-4 py-2 text-white  bg-green-400";