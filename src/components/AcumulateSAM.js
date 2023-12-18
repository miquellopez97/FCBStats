import React from 'react';
import SamStats from './SamStats';
import Sam from '../data/Ivf/SamTeam.js';
import './Acumulate.css';


const Acumulate = () => {

  function toggleDiv(gameIndex) {
    const contenido = document.getElementById(`contenido-${gameIndex}`);
    if (contenido) {
      contenido.style.display = contenido.style.display === 'none' || contenido.style.display === '' ? 'block' : 'none';
    }
  }

  return (
    <div>
      {Sam.games && Sam.games.length > 0 && Sam.games.map((game, index) => (
      <div key={index} className="contenedor" id={`contenedor-${index}`}>
        <div className="cabecera" onClick={() => toggleDiv(index)}>
          {game.rival}
        </div>
        <div className="contenido" id={`contenido-${index}`}>
          <SamStats gameID={game.gameId} teamID={game.idTeam} teamName={Sam.teamName} />
        </div>
      </div>
    ))}
    </div>
  );
};

export default Acumulate;
