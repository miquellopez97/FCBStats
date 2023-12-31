import React from 'react';

const SecondMap = ({ jugadoras }) => {
  // Función para actualizar el array secondGuide según los segundos de entrada
  const addMap = (jugadora) => {
    jugadora.secondGuide = new Array(40).fill().map(() => [0, 0, 0]);
  };

  const calcMin = (jugadora) => {
    jugadora.segundosEntrada.forEach((segundoEntrada) => {
      const indiceMinuto = Math.floor(segundoEntrada / 60);
      const indiceSegundo = segundoEntrada % 60;

      const indiceMin = Math.min(indiceMinuto, 39);
      const indiceSec = Math.min(Math.floor(indiceSegundo / 20), 2);

      jugadora.secondGuide[indiceMin][indiceSec] = 1;
    });

    jugadora.segundosSalida.forEach((segundosSalida) => {
      const indiceMinuto = Math.floor(segundosSalida / 60);
      const indiceSegundo = segundosSalida % 60;

      const indiceMin = Math.min(indiceMinuto, 39);
      const indiceSec = Math.min(Math.floor(indiceSegundo / 20), 2);

      jugadora.secondGuide[indiceMin][indiceSec] = 3;
    });
  };

  const corregirSegundoGuide = (jugadoras) => {
    for (let i = 0; i < jugadoras.length; i++) {
      for (let j = 0; j < jugadoras[i].secondGuide.length; j++) {
        // Posicion 0 del subArray
        if (j > 0 && jugadoras[i].secondGuide[j][0] === 0 && (jugadoras[i].secondGuide[j-1]?.[2] === 1 || jugadoras[i].secondGuide[j-1]?.[2] === 2)) {
          jugadoras[i].secondGuide[j][0] = 2;
        }
        // Posicion 1 del subArray
        if ((jugadoras[i].secondGuide[j][0] === 1 || jugadoras[i].secondGuide[j][0] === 2) && jugadoras[i].secondGuide[j][1] === 0) {
          jugadoras[i].secondGuide[j][1] = 2;
        }
        // Posicion 2 del subArray
        if (jugadoras[i].secondGuide[j][2] === 0 && (jugadoras[i].secondGuide[j][1] === 1 || jugadoras[i].secondGuide[j][1] === 2)) {
          jugadoras[i].secondGuide[j][2] = 2;
        }
      }
    }
  };

  // Actualizar segundosEntrada en secondGuide para cada jugadora
  jugadoras.forEach((jugadora) => {
    addMap(jugadora);
    calcMin(jugadora);
  });

  corregirSegundoGuide(jugadoras);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Número</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {jugadoras.map((jugadora, index) => (
            <tr key={index}>
              <td>{jugadora.number}</td>
              <td>{jugadora.name.length > 14 ? `${jugadora.name.slice(0, 14)}...` : jugadora.name}</td>
              <td style={{ whiteSpace: 'nowrap', width: '200px' }}>
              {jugadora.secondGuide.map((value, index) => (
                <span>
                  <span
                    key={index}
                    style={{ color: value[0] === 0 ? 'white' : 'black', backgroundColor: value[0] === 0 ? 'white' : 'black'}}
                  >
                    {value[0]}
                  </span>
                  <span
                    key={index}
                    style={{ color: value[1] === 0 ? 'white' : 'black', backgroundColor: value[1] === 0 ? 'white' : 'black' }}
                  >
                    {value[1]}
                  </span>
                  <span
                    key={index}
                    style={{ color: value[2] === 0 ? 'white' : 'black', backgroundColor: value[2] === 0 ? 'white' : 'black' }}
                  >
                    {value[2]}
                  </span>
                </span>
              ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecondMap;
