import React from 'react';
import teamsData from "../data/Sam/IvfLeague";
import Team from "./Team";
// import './League.css';
import Acumulate from './Acumulate';

const League = (team) => {
  console.log(team);
  return (
    <div className="team-container">
        <h2 className="team-name">{team.team.teamName}</h2>
        {/* <img className="team-logo" src={team.team.teamPhoto} alt="teamLogo" /> */}
        <Acumulate team={team.team}/>
      </div>
  );
};

export default League;
