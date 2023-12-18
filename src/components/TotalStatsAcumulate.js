import 'bootstrap/dist/css/bootstrap.min.css';
import {useTeamContext} from '../StatsProvider';

const TotalStatsAcumulate = () => {

  const acumulateStats = useTeamContext();

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <table className="table col-md-6">
          <thead className="thead-dark">
            <tr>
              <th>Nombre</th>
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
            {acumulateStats && acumulateStats.slice(1).map((jugadora, index) => (
              <tr key={index}>
                <td>{jugadora.name}</td>
                <td>{jugadora.min}</td>
                <td>{jugadora.pts}</td>
                <td>{jugadora.tLibresA}/{jugadora.tLibresI}</td>
                <td>{jugadora.tDos}</td>
                <td>{jugadora.tTres}</td>
                <td>{jugadora.masMenos}</td>
                <td>{(jugadora.masMenos / jugadora.min).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalStatsAcumulate;