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
    console.log(firstPokemon.data?.name)

    return (
        <div>
            <div className='text-2xl text-center'>
                Which Anime Do You Like?
            </div>
            <div className='p-2' />
            <div className='border rounded p-8 flex justify-between max-w-2xl'>
                <div className='w-64 h-64 flex flex-col'>
                    <img src={firstPokemon.data?.sprites?.toString().slice(57)}
                        className="w-full" />
                    <div className='text-xl text-center capitalize'>{firstPokemon.data?.name}</div>
                </div>
                VS
                <div className='w-64 h-64 flex flex-col'>
                    <img src={secondPokemon.data?.sprites?.toString().slice(57)}
                        className="w-full" />
                    <div className='text-xl text-center capitalize'>{secondPokemon.data?.name}</div>
                </div>
            </div>
        </div >
    )
}
