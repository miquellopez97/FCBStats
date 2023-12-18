import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useCalcContext} from '../StatsProvider';

const IvfStats = ({gameID, teamID, teamName}) => {
  const jugadorasEquipo = [];
  let desiredTeam = [];

  const estadisticasIniciales = {
    MinutosCuartos: ``,
  };
  
  //Constante con todas las jugadas del partido
  const [data, setData] = useState({});
  const [min, setMin] = useState({});

  useEffect(() => {
    const fetchMin = async () => {
      try {
        const url = 'https://msstats.optimalwayconsulting.com/v1/fcbq/getJsonWithMatchStats/'+ gameID +'?currentSeason=true';
        const response = await axios.get(url);
        setMin(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchMin();
  }, [gameID]);
  
  if (min && min.teams) {
    desiredTeam = min.teams.find(team => team.name === 'C.B GRUP BARNA VERMELL');
  } else {
    console.error('min or min.teams is undefined.');
  }

  //Obtener las jugadas de la fede
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://msstats.optimalwayconsulting.com/v1/fcbq/getJsonWithMatchMoves/'+ gameID +'?currentSeason=true';
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [gameID]);
  for (const key in data) {
    if (data[key].idTeam === teamID && data[key].actorName !== teamName) {
      const yaAgregada = jugadorasEquipo.some(
        (jugadora) => jugadora.name === data[key].actorName
      );
  
      if (!yaAgregada) {
        const jugador = {
          number: data[key].actorShirtNumber,
          name: data[key].actorName,
          ...estadisticasIniciales,
        };
        jugadorasEquipo.push(jugador);
      }
    }
  }

  //Convertimos el objeto en un array
  const eventosArray = Object.values(data);

  const enterOnCourt = (evento) => {
    const jugadora = jugadorasEquipo.find(
      (jugadora) => jugadora.name === evento.actorName
    );
  
      // Marcar a la jugadora como en la cancha y actualizar el tiempo de entrada
    if (jugadora) {
      if (!jugadora.onCourt) {
        jugadora.onCourt = true;
        jugadora.MinutosCuartos += `[ (P${evento.period}) ${evento.min}:${evento.sec}-`;
      }
    }else {}
  };

    const outOnCourt = (evento) => {
      const jugadora = jugadorasEquipo.find(
        (jugadora) => jugadora.name === evento.actorName
      );
    
        // Marcar a la jugadora como en la cancha y actualizar el tiempo de entrada
      if (jugadora) {
        jugadora.onCourt = false;
        jugadora.MinutosCuartos += `(P${evento.period}) ${evento.min}:${evento.sec}] - `;
      }else {}
      };

  //Repasamos las jugadas para acumular las estadísticas
  for (const evento of eventosArray) {
    switch (evento.idMove) {
      case 112:
        enterOnCourt(evento);
        break;
      //Surt del camp = 115
      case 115:
        outOnCourt(evento);
        break;
      default:
        break;
    }
  }

  jugadorasEquipo.forEach(jugadora => {
    try {
      const matchingPlayer = desiredTeam.players.find(player => player.name === jugadora.name);
  
      if (matchingPlayer) {
        jugadora.min = matchingPlayer.timePlayed;
      } else {
        console.warn(`No se encontró un jugador correspondiente para ${jugadora.name}`);
      }
    } catch (error) {
      console.error('Ocurrió un error al buscar y asignar minutos:', error);
    }
  });

  jugadorasEquipo.unshift({gameID : gameID});

  //Ordenamos el array por número de camiseta
  const jugadorasStats = jugadorasEquipo.sort((a, b) => parseInt(a.number) - parseInt(b.number));

  useCalcContext(jugadorasStats);

  jugadorasEquipo.forEach(element => {
    if (element.MinutosCuartos) {
      // Verificar si el valor comienza con "undefined"
      if (element.MinutosCuartos.startsWith('undefined')) {
        // Eliminar la parte "undefined" de la cadena
        element.MinutosCuartos = element.MinutosCuartos.slice('undefined'.length);
      }

      if (/\d-$/.test(element.MinutosCuartos)) {
        // Agregar al final el valor (P4) 10:0]
        element.MinutosCuartos = `${element.MinutosCuartos}(P4) 00:00]`;
      }
  
      // Verificar si el valor no comienza con "P"
      if (!element.MinutosCuartos.startsWith('[')) {
        // Agregar al principio el valor P1[10:0]
        element.MinutosCuartos = `[ (P1) 10:0-${element.MinutosCuartos}`;
      }

      element.MinutosCuartos = element.MinutosCuartos.replace(/-\s*$/, '');
    }
  });

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <table className="table col-md-6">
          <thead className="thead-dark">
            <tr>
              <th>Número de Camiseta</th>
              <th>Nombre</th>
              <th>Entra</th>
            </tr>
          </thead>
          <tbody>
            {jugadorasStats.slice(1).map((jugadora, index) => (
              jugadora.name !== 'C.B GRUP BARNA A' && (
                <tr key={index}>
                  <td>{jugadora.number}</td>
                  <td>{jugadora.name}</td>
                  <td>{jugadora.MinutosCuartos}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IvfStats;