import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Map from './Map';

const IvfStats = ({gameID, teamID, teamName}) => {
  const jugadorasEquipo = [];
  let desiredTeam = [];

  const estadisticasIniciales = {
    pts: 0,
    tLibresA: 0,
    tLibresI: 0,
    tDos: 0,
    tTres: 0,
    masMenos: 0,
    onCourt: false,
    start: false,
    min:0,
    masMenosMin: 0,
    minutosCuartos: ``,
    segundosEntrada: [],
    segundosSalida: [],
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
    desiredTeam = min.teams.find(team => team.name === 'C.B GRUP BARNA VERMELL' || team.name === 'SESE B');
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

  //Recorremos el objeto de jugadas para obtener las jugadoras del equipo
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
          segundosEntrada: [],
          segundosSalida: [],
        };
        jugadorasEquipo.push(jugador);
      }
    }
  }

  //Convertimos el objeto en un array
  const eventosArray = Object.values(data);

  //Función para sumar los tiros libres
  const shootTL = (evento) => {
    const jugadora = jugadorasEquipo.find(
      (jugadora) => jugadora.name === evento.actorName
    );
  
    if (jugadora) {
      jugadora.tLibresI += 1;
      if (evento.idMove === 92) {
        jugadora.tLibresA += 1;
        jugadora.pts += 1;
        calcMasMenos(1);
      }
    }else {
      if (evento.idMove === 92) {
        calcMasMenos(-1);
      }
    }
  };

  const calcMasMenos = (value) => {
    jugadorasEquipo.forEach((jugadora) => {
      if (jugadora.onCourt) {
        jugadora.masMenos += value;
      }
    });
  };

  //Función para sumar los tiros de campo
  const courtShoot = (evento) => {
    const jugadora = jugadorasEquipo.find(
      (jugadora) => jugadora.name === evento.actorName
    );

    const value = evento.idMove === 93 ? 2 : 3;
  
    if (jugadora) {
      if (value === 2){
        jugadora.tDos += 1;
        jugadora.pts += 2;
        calcMasMenos(2);
      } else {
        jugadora.tTres += 1;
        jugadora.pts += 3;
        calcMasMenos(3);
      }
    }else {
      if(value === 2){
        calcMasMenos(-2);
      } else {
        calcMasMenos(-3);
      } 
    }
  };

  const marcarTitular = () => {
    const jugadorasTitulares = new Set();
  
    for (let i = 0; i < eventosArray.length; i++) {
      const evento = eventosArray[i];
      if (evento.idMove === 115 && !jugadorasTitulares.has(evento.actorName)) {
        // Verificar si la jugadora ha tenido un evento de entrada al campo antes de este evento de salida
        const entradaCampoAntes = eventosArray.slice(0, i).find(
          (e) => e.idMove === 112 && e.actorName === evento.actorName
        );
        if (!entradaCampoAntes) {
          const jugadora = jugadorasEquipo.find(
            (jugadora) => jugadora.name === evento.actorName
          );
          if (jugadora) {
            jugadora.start = true;
            jugadora.segundosEntrada.push(0);
            jugadorasTitulares.add(evento.actorName);
          }
        }
      }
    }

    // Actualizar jugadorasEquipo con la información de titulares
    jugadorasEquipo.forEach((jugadora) => {
    jugadora.start = jugadorasTitulares.has(jugadora.name);
    jugadora.onCourt = jugadorasTitulares.has(jugadora.name);
  });
  };
  marcarTitular();

  function tiempoASegundos(cuarto, minutos, segundos) {
    // Verificar si el cuarto es prorroga
    const duracionCuarto = cuarto > 4 ? 5 : 10;

    // Reflejar el tiempo transcurrido en el partido en segundos
    return ((cuarto - 1) * 600) + (duracionCuarto - minutos) * 60 - segundos; 
  }

  const enterOnCourt = (evento) => {
    const jugadora = jugadorasEquipo.find(
      (jugadora) => jugadora.name === evento.actorName
    );
  
      // Marcar a la jugadora como en la cancha y actualizar el tiempo de entrada
    if (jugadora) {
      if (!jugadora.onCourt) {
        jugadora.onCourt = true;
        jugadora.minutosCuartos += `[ (P${evento.period}) ${evento.min}:${evento.sec}-`;

        var nuevoSegundo = tiempoASegundos(evento.period, evento.min, evento.sec);
        if (!jugadora.segundosEntrada.includes(nuevoSegundo)) {
          jugadora.segundosEntrada.push(nuevoSegundo);
        }
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
      jugadora.minutosCuartos += `(P${evento.period}) ${evento.min}:${evento.sec}] - `;

      var nuevoSegundo = tiempoASegundos(evento.period, evento.min, evento.sec);
      if (!jugadora.segundosSalida.includes(nuevoSegundo)) {
        jugadora.segundosSalida.push(nuevoSegundo);
      }
    }else {}
    };

  //Repasamos las jugadas para acumular las estadísticas
  for (const evento of eventosArray) {
    switch (evento.idMove) {
      //TL fallat 96 i TL anotat 92
      case 92:
      case 96:
        shootTL(evento);
        break;
      //T2 anotat 93 i T3 anotat 94
      case 93:
      case 94:
        courtShoot(evento);
        break;
      //Entra al camp = 112
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

  //Asignar el tiempo de juego a cada jugadora
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

  //Eliminamos el jugador con nombre del equipo
  jugadorasEquipo.unshift({gameID : gameID});

  //Ordenamos el array por número de camiseta
  const jugadorasStats = jugadorasEquipo.sort((a, b) => parseInt(a.number) - parseInt(b.number));
  
  //Ponemos los minutos de los cuartos en el formato correcto
  jugadorasEquipo.forEach(element => {
    if (element.minutosCuartos) {
      // Verificar si el valor comienza con "undefined"
      if (element.minutosCuartos.startsWith('undefined')) {
        // Eliminar la parte "undefined" de la cadena
        element.minutosCuartos = element.minutosCuartos.slice('undefined'.length);
      }

      if (/\d-$/.test(element.minutosCuartos)) {
        // Agregar al final el valor (P4) 10:0]
        element.minutosCuartos = `${element.minutosCuartos}(P4) 00:00]`;
        element.segundosSalida.push(2400);
      }
  
      // Verificar si el valor no comienza con "P"
      if (!element.minutosCuartos.startsWith('[')) {
        // Agregar al principio el valor P1[10:0]
        element.minutosCuartos = `[ (P1) 10:0-${element.minutosCuartos}`;
      }

      element.minutosCuartos = element.minutosCuartos.replace(/-\s*$/, '');
    }
  });

  //Filtramos solo jugadores reales
  const jugadorasFiltradas = jugadorasStats.filter((jugadora) => jugadora.number && jugadora.number.trim() !== '');

  console.log(jugadorasFiltradas);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <table className="table table-striped col-md-6">
          <thead className="thead-dark">
            <tr>
              <th>Número de Camiseta</th>
              <th>Nombre</th>
              <th>Titular</th>
              <th>Min</th>
              <th>Pts</th>
              <th>TL</th>
              <th>T2</th>
              <th>T3</th>
              <th>+/-</th>
              <th>(+/-)/min</th>
            </tr>
          </thead>
          <tbody>
            {jugadorasFiltradas.map((jugadora, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{jugadora.number}</td>
                  <td>{jugadora.name}</td>
                  <td>{jugadora.start ? `X` : ``}</td>
                  <td>{jugadora.min}</td>
                  <td>{jugadora.pts}</td>
                  <td>{jugadora.tLibresA}/{jugadora.tLibresI}</td>
                  <td>{jugadora.tDos}</td>
                  <td>{jugadora.tTres}</td>
                  <td>{jugadora.masMenos}</td>
                  <td>{(jugadora.masMenos / jugadora.min).toFixed(2)}</td>
                </tr>
                <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>          
                  {jugadora.minutosCuartos}
                </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Map jugadoras={jugadorasFiltradas}/>
      </div>
    </div>
  );
};

export default IvfStats;