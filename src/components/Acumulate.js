import React, { useState } from 'react';
import IvfStats from './IvfStats';
import './Acumulate.css';

const Acumulate = ({ team }) => {
  const [visibleGames, setVisibleGames] = useState({});

  const toggleDiv = (gameIndex) => {
    setVisibleGames((prevVisibleGames) => ({
      ...prevVisibleGames,
      [gameIndex]: !prevVisibleGames[gameIndex],
    }));
  };

  return (
    <div>
      {team.games && team.games.length > 0 && team.games.map((game, index) => (
        <div key={index} className="contenedor" id={`contenedor-${index}`}>
          <div className="cabecera" onClick={() => toggleDiv(index)}>
            {game.rival}
          </div>
          <div className="contenido" style={{ display: visibleGames[index] ? 'block' : 'none' }}>
            <IvfStats gameID={game.gameId} teamID={game.idTeam} teamName={team.teamName} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Acumulate;
