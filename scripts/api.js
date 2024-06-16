window.onload = async () => {
    try {
        let offset = 0
        // fetch the pokemons
        let pokemons = await fetchApiPoke(offset)

        // render pokemon saat di-load
        await renderPokemonCard(pokemons)

        // at the start, hide previous button
        if (offset === 0) {
            document.getElementById('previous').classList.add('hidden')
        }

        // previous collection of data button
        document.getElementById('previous').addEventListener('click', async () => {
            offset -= 20
            pokemons = await fetchApiPoke(offset)
            await renderPokemonCard(pokemons)

            // check the offset value to hide the previous button
            if (offset === 0) {
                document.getElementById('previous').classList.add('hidden')
            }
        })

        // next collection of data button
        document.getElementById('next').addEventListener('click', async () => {
            offset += 20
            pokemons = await fetchApiPoke(offset)
            await renderPokemonCard(pokemons)

            // check the offset value to show the previous button
            if (offset > 0) {
                document.getElementById('previous').classList.remove('hidden')
            }
        })

        // search input untuk filter data
        document.getElementById('search').addEventListener('keypress', async (event) => {
            if (event.key === 'Enter') {
                // search value in lowercase
                const searchValue = event.target.value.toLowerCase()

                pokemons = await fetchApiPoke(offset, 1302)

                // checking the search value to set the limit of fetching datas and go to initial state
                if (searchValue === '') {
                    offset = 0
                    pokemons = await fetchApiPoke(offset, 20)

                    // show the next action button
                    document.getElementById('next').classList.remove('hidden')
                } else {
                    // hide the action button when searching
                    document.getElementById('previous').classList.add('hidden')
                    document.getElementById('next').classList.add('hidden')
                }

                // filter the pokemon from search
                const filteredPokemons = pokemons.filter((pokemon) => {
                    return pokemon.name.toLowerCase().includes(searchValue)
                })

                // change the data with filtered data
                await renderPokemonCard(filteredPokemons)
            }
        })

        // on click title
        document.getElementById('title').addEventListener('click', async () => {
            // set the offset to 0 and render it again
            pokemons = await fetchApiPoke(0)
            await renderPokemonCard(pokemons)

            document.getElementById('previous').classList.add('hidden')
        })

    } catch (error) {
        console.log(error)
    }

    // implement close modal functionality
    closeModal()
}

async function renderPokemonCard(pokemons) {
    // get the container element
    const pokeContainer = document.getElementById('poke-container')

    // clear the container before re-render
    pokeContainer.innerHTML = ''

    pokemons.forEach(async (pokemon) => {
        try {
            // fetch pokemon detail
            const pokemonUrl = await fetch(pokemon.url)
            const resultPokemonUrl = await pokemonUrl.json()

            // create pokeCard item
            const pokeCard = document.createElement('div')
            pokeCard.className = "flex flex-col justify-center hover:cursor-pointer items-center mt-2 p-5 bg-white border hover:opacity-75 transition border-gray-200 rounded-lg shadow"
            pokeCard.innerHTML += `
                        <img class="" src="${resultPokemonUrl.sprites.front_default}" />
                        <div class="px-2 pt-1">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 first-letter:uppercase">${pokemon.name}</h5>
                        </div>
                `
            // add click event listener to open modal and set the modal data
            pokeCard.addEventListener('click', () => {
                // set modal content with pokemon data
                document.getElementById('modal-title').textContent = `${pokemon.name}`;
                document.getElementById('modal-image').src = resultPokemonUrl.sprites.front_default
                document.getElementById('pokemon-height').innerHTML = `Height <b>${resultPokemonUrl.height}</b>`
                document.getElementById('pokemon-weight').innerHTML = `Weight <b>${resultPokemonUrl.weight}</b>`
                document.getElementById('pokemon-hp').innerHTML = `HP <b>${resultPokemonUrl.stats[0].base_stat}</b>`
                document.getElementById('pokemon-atk').innerHTML = `ATK <b>${resultPokemonUrl.stats[1].base_stat}</b>`
                document.getElementById('pokemon-def').innerHTML = `DEF <b>${resultPokemonUrl.stats[2].base_stat}</b>`
                document.getElementById('pokemon-spd').innerHTML = `SPD <b>${resultPokemonUrl.stats[5].base_stat}</b>`

                // pokemon abilities
                const abilitiesContainer = document.getElementById('abilities-container');
                abilitiesContainer.innerHTML = '' // Clear previous abilities

                resultPokemonUrl.abilities.forEach((ability) => {
                    // create pokemon ability item
                    const pokemonAbility = document.createElement('p')
                    pokemonAbility.className = "px-4 first-letter:uppercase py-1 rounded-full text-white bg-[#EF5350]"
                    pokemonAbility.textContent = ability.ability.name

                    // isert pokemon ability item to pokemon abilities
                    abilitiesContainer.appendChild(pokemonAbility)
                });

                // pokemon types
                const typesContainer = document.getElementById('types-container');
                typesContainer.innerHTML = '' // Clear previous abilities

                resultPokemonUrl.types.forEach((type) => {
                    // create pokemon ability item
                    const pokemonType = document.createElement('p')
                    pokemonType.className = "px-4 first-letter:uppercase py-1 rounded-full text-white bg-[#EF5350]"
                    pokemonType.textContent = type.type.name
                    // isert pokemon ability item to pokemon abilities
                    typesContainer.appendChild(pokemonType)
                });

                // remove the hidden class to show the modal
                document.getElementById('pokemon-modal').classList.remove('hidden')
            })


            // insert poke card data
            pokeContainer.appendChild(pokeCard)
        } catch (error) {
            console.log(error)
        }
    });
}

async function fetchApiPoke(offset, limit = 20) {
    try {
        // fetch the api
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)

        // get the result
        const resultJson = await response.json()

        // results
        return resultJson.results

    } catch (error) {
        console.log(error)
    }
}

function closeModal() {
    // close modal function 
    const hideModal = () => {
        document.getElementById('pokemon-modal').classList.add('hidden')
    }

    // add event listener to click for close button and modal overlay
    document.getElementById('modal-close').addEventListener('click', hideModal)
    document.getElementById('modal-overlay').addEventListener('click', hideModal)
}