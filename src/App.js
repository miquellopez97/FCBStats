import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import League from './components/League';
import TeamDetails from './components/TeamDetails';
import especificId from './data/Ivf/IvfTeam';

const App = () => {
  const specificComponentId = especificId.teamId; // Supongamos que queremos mostrar Acumulate para la ID 1

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<League />} />
        <Route
          path="/team/:teamName"
          element={
            <TeamDetails specificComponentId={specificComponentId}/>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
