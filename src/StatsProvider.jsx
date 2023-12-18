import React, { useState, useContext } from "react";

const teamContext = React.createContext();
const calcContext = React.createContext();

export function useTeamContext() {
    return useContext(teamContext);
}

export function useCalcContext() {
    return useContext(calcContext);
}

export function StatsProvider(props) {

    const team = [
        { id: "sdbnafkjb4kjt34b9"},
        { name: "Juana", points: 0, rebounds: 0, assists: 0 },
    ]

    const [acumulateStats, setAcumulateStats] = useState(team);

    const calcStats = (jugadorasStats) => {
        if(acumulateStats){
            setAcumulateStats(null);
        } else {
            setAcumulateStats(jugadorasStats);
        }
    }

    return (
        <teamContext.Provider value={acumulateStats}>
            <calcContext.Provider value={calcStats}>
                {props.children}
            </calcContext.Provider>
        </teamContext.Provider>
    );
}