import { useState } from 'react'
import type React from 'react'
import { inferQueryResponse } from '../pages/api/trpc/[trpc]'
import { getOptionsForVote } from '../utils/getRandomPokemon'
import { trpc } from '../utils/trpc'

export const StageArea = () => {
    const [ids, updateIds] = useState(() => getOptionsForVote())
    const [point, setPoint] = useState(0)

    const [first, second] = ids

    const firstPokemon = trpc.useQuery(["pokemon.get-pokemon-by-id", { id: first! }])
    const secondPokemon = trpc.useQuery(["pokemon.get-pokemon-by-id", { id: second! }])

    const voteMutaion = trpc.useMutation(["pokemon.cast-vote"])

    const voteForPowerful = (selected: number) => {
        // TODO: fire mutations to presist changes
        console.log(firstPokemon.data?.name, firstPokemon.data?.attack)
        console.log(secondPokemon.data?.name, secondPokemon.data?.attack)

        //if selected pokemon has more attack add point otherwise remove point
        if (selected === first) {
            voteMutaion.mutate({ votedFor: first!, votedAgainst: second! })
            if (firstPokemon.data?.attack! > secondPokemon.data?.attack!) {
                setPoint(point + 1)
            }
            else if (firstPokemon.data?.attack! < secondPokemon.data?.attack!) {
                setPoint(0)
            }
            else {
                setPoint(point)
            }
        }
        else {
            voteMutaion.mutate({ votedFor: second!, votedAgainst: first! })
            if (secondPokemon.data?.attack! > firstPokemon.data?.attack!) {
                setPoint(point + 1)
            }
            else if (secondPokemon.data?.attack! < firstPokemon.data?.attack!) {
                setPoint(0)
            }
            else {
                setPoint(point)
            }

        }

        updateIds(getOptionsForVote())

    }

    return (
        <div>
            <div className='text-2xl text-center'>
                Which Pokemon Do You Like?
            </div>
            <div className='text-4xl text-blue-500 ml-72'>{point}</div>
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
        <img src={props.pokemon.sprites?.toString()}
            className="w-64 h-64" />
        <div className='text-xl text-center capitalize'>{props.pokemon.name}</div>
        <button
            onClick={() => props.vote()}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Attack
        </button>
    </div>)
}
