import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chip, Modal, Backdrop, Fade } from "@mui/material";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const pokemonTypes = {
    ground: "brown",
    water: "blue",
    bug: "green",
    fire: "red",
    flying: "#A9CFFF",
    poison: "#BE0ED1",
  };

  useEffect(() => {
    const fetchPokemonData = async () => {
      setError(null);

      try {
        const pokemonListResponse = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=100"
        );

        const pokemonList = pokemonListResponse.data.results;

        const pokemonDataPromises = pokemonList.map(async (pokemon) => {
          const response = await axios.get(pokemon.url);
          return response.data;
        });

        const fetchedPokemons = await Promise.all(pokemonDataPromises);
        setPokemons(fetchedPokemons);
      } catch (error) {
        console.error(error);
        setError(
          "Hubo un error al obtener datos de los Pokemon. Intenta nuevamente."
        );
      }
    };

    fetchPokemonData();
  }, []);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    const filteredResults = pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemons(filteredResults);
    setSelectedPokemon(null); // Limpia el poke seleccionado
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <>
      <section id="section1">
        <input
          id="input1"
          type="text"
          placeholder="Ingresa Nombre o Caracteres del Pokémon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} id="buscar">
          Buscar
        </button>
      </section>

      <div id="cards">
        {filteredPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="card"
            onClick={() => {
              handlePokemonClick(pokemon);
              handleOpen(); // Abre el modal
            }}
          >
            <h2>{pokemon.id}</h2>
            <img
              id="imagenes"
              src={pokemon.sprites.front_shiny}
              alt={`${pokemon.name} sprite`}
            />
            <h2>{pokemon.name}</h2>
          </div>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedPokemon && (
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className="contenidomodal">
              <h2 id='nombremod'>{selectedPokemon.name}</h2>
              <img
                id="imagenes"
                src={selectedPokemon.sprites.front_shiny}
                alt={`${selectedPokemon.name} sprite`}
              />
              {selectedPokemon.types.map((type) => (
                <Chip
                  key={type.type.name}
                  label={type.type.name}
                  color="primary"
                  variant="outlined"
                  style={{ backgroundColor: pokemonTypes[type.type.name] }}
                />
              ))}
              <div id='attrib'>
                Habilidades:{" "}
                {selectedPokemon.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}
              </div>

              <div id='attrib'>
                Velocidad:{" "}
                {
                  selectedPokemon.stats.find(
                    (stat) => stat.stat.name === "speed"
                  ).base_stat
                }
                <div id='attrib'>
                  Ataque: {""}
                  {
                    selectedPokemon.stats.find(
                      (stat) => stat.stat.name === "attack"
                    ).base_stat
                  }
                </div>
                <div id='attrib'>
                  Defenza: {""}
                  {
                    selectedPokemon.stats.find(
                      (stat) => stat.stat.name === "defense"
                    ).base_stat
                  }
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      )}
    </>
  );
}

export default App;

