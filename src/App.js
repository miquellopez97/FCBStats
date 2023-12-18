import React from 'react';
import ivf from './data/Ivf/IvfTeam';
import AcumulateSAM from './components/AcumulateSAM';
import League from './components/League.js';
import sese from './data/Ivf/Sese';

const App = () => {// Supongamos que queremos mostrar Acumulate para la ID 1

  return (
    <div>
      <h2 className="team-name">SAM</h2>
      <AcumulateSAM/>
      <League team={ivf}/>
      <League team={sese}/>
    </div>
  );
};

export default App;
