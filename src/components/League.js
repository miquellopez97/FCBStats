import React from 'react';
import teamsData from "../data/Ivf/IvfLeague";
import Team from "./Team";
import './League.css';

const League = () => {
  return (
    <div className="league-container">
      <h1>Infantil femeni 1r any</h1>
      <div className="teams">
        {teamsData.map((team) => (
          <Team key={team.id} teamName={team.name} teamLogo={team.teamPhoto} />
        ))}
      </div>
    </div>
  );
};

export default League;
