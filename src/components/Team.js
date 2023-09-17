import React from 'react';
import { Link } from 'react-router-dom';  // Importa Link desde react-router-dom
import './Team.css';

const Team = ({ teamLogo, teamName }) => {
  return (
    <Link to={`/team/${teamName}`} className="team-link">  {/* Agrega un Link */}
      <div className="team-container">
        <h2 className="team-name">{teamName}</h2>
        <img className="team-logo" src={teamLogo} alt="teamLogo" />
      </div>
    </Link>
  );
};

export default Team;
