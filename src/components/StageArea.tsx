import { useState } from 'react'
import type React from 'react'
import { inferQueryResponse } from '../pages/api/trpc/[trpc]'
import { getOptionsForVote } from '../utils/getRandomPokemon'
import { trpc } from '../utils/trpc'

export const StageArea = () => {
    const [ids, updateIds] = useState(() => getOptionsForVote())

    const [first, second] = ids

    const firstPokemon = trpc.useQuery(["pokemon.get-pokemon-by-id", { id: first }])
    const secondPokemon = trpc.useQuery(["pokemon.get-pokemon-by-id", { id: second }])

    const voteForPowerful = (selected: number) => {
        // TODO: fire mutations to presist changes
        updateIds(getOptionsForVote())
    }

    return (
        <div>
            <div className='text-2xl text-center'>
                Which Anime Do You Like?
            </div>
            <div className='p-2' />
            <div className='border rounded p-8 flex justify-between max-w-2xl h-auto'>
                <>
                    {!firstPokemon.isLoading &&
                        firstPokemon.data &&
                        secondPokemon.data &&
                        !secondPokemon.isLoading && (
                            <PokemonListing pokemon={firstPokemon.data} vote={() => voteForPowerful(first!)} />
                        )}
                </>
                VS
                <>
                    {!firstPokemon.isLoading &&
                        firstPokemon.data &&
                        secondPokemon.data &&
                        !secondPokemon.isLoading && (
                            <PokemonListing pokemon={secondPokemon.data} vote={() => voteForPowerful(second!)} />
                        )}
                </>
            </div>
        </div >
    )
}
type PokemonFromServer = inferQueryResponse<"pokemon.get-pokemon-by-id">

const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = (props) => {

    return (<div className='flex flex-col'>
        <img src={props.pokemon.sprites?.toString().slice(57)}
            className="w-64 h-64" />
        <div className='text-xl text-center capitalize'>{props.pokemon.name}</div>
        <button
            onClick={() => props.vote()}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Attack
        </button>
    </div>)
}
