
const MAX_POKEMON_ID = 1000

export const getRandomPokemon: (notThisNumber?: number) => number =  (notThisNumber) => {
  const pokemonNumber = Math.floor(Math.random() * MAX_POKEMON_ID) + 1

  if (pokemonNumber !== notThisNumber) return pokemonNumber
    return getRandomPokemon(notThisNumber)

}

export const getOptionsForVote = () => {
    const firstId = getRandomPokemon()
    const secondId = getRandomPokemon(firstId)
    return [firstId, secondId]
}