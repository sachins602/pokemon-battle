import { useState } from 'react'
import { getOptionsForVote } from '../utils/getRandomPokemon'
import { trpc } from '../utils/trpc'

export const StageArea = () => {
    const [ids, updateIds] = useState(() => getOptionsForVote())

    const [first, second] = ids

    const firstPokemon = trpc.useQuery(["pokemon.get-pokemon-by-id", { id: first }])
    const secondPokemon = trpc.useQuery(["pokemon.get-pokemon-by-id", { id: second }])

    if (firstPokemon.isLoading || secondPokemon.isLoading) {
        return <div>Loading...</div>
    }

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
                <div className='w-64 h-64 flex flex-col'>
                    <img src={firstPokemon.data?.sprites?.toString().slice(57)}
                        className="w-full" />
                    <div className='text-xl text-center capitalize'>{firstPokemon.data?.name}</div>
                    <button
                        onClick={() => voteForPowerful(first!)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Attack
                    </button>
                </div>
                VS
                <div className='w-64 h-64 flex flex-col'>
                    <img src={secondPokemon.data?.sprites?.toString().slice(57)}
                        className="w-full" />
                    <div className='text-xl text-center capitalize'>{secondPokemon.data?.name}</div>
                    <button
                        onClick={() => voteForPowerful(second!)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Attack
                    </button>
                </div>
            </div>
        </div >
    )
}
