import React from 'react';
import Acumulate from './Acumulate';
import teamsData from '../data/Ivf/IvfLeague';
import NormalTeam from './NormalTeam';

const TeamDetails = ({ specificComponentId }) => {
  // Obtenemos el nombre del equipo de la URL
  const teamNameFromURL = decodeURIComponent(window.location.pathname.split('/').pop());

  // Lógica para determinar qué componente mostrar según el nombre del equipo
  const isSpecificTeam = teamsData.some(team => {
    return team.name === teamNameFromURL && team.id === specificComponentId;
  });

  const ComponentToRender = isSpecificTeam ? Acumulate : NormalTeam;

  console.log(teamNameFromURL);
  console.log(teamsData);

  return (
    <div>
      {/* Renderiza el componente específico basado en el nombre y ID del equipo */}
      <ComponentToRender />
    </div>
  );
};

export default TeamDetails;
