import React from 'react';
import Acumulate from './Acumulate';

const League = (team) => {
  return (
    <div className="team-container">
      <h2 className="team-name">{team.team.teamName}</h2>
      <Acumulate team={team.team}/>
    </div>
  );
};

export default League;
