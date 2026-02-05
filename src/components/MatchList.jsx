import React, { useEffect, useState } from 'react';
import { fetchMatches } from '../services/api';
import './MatchList.css';

const MatchList = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDateForApi = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    useEffect(() => {
        const loadMatches = async () => {
            setLoading(true); // Ensure loading state is true when date changes
            try {
                const dateStr = formatDateForApi(currentDate);
                const data = await fetchMatches(dateStr);
                setMatches(data.matches || []);
                setError(null);
            } catch (err) {
                setError(err.message);
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        loadMatches();
    }, [currentDate]);

    const handlePrevDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // Group matches by Competition
    const groupedMatches = matches.reduce((acc, match) => {
        const competitionObj = match.competition;
        const competitionName = competitionObj.name;

        if (!acc[competitionName]) {
            acc[competitionName] = { ...competitionObj, matches: [] };
        }
        acc[competitionName].matches.push(match);
        return acc;
    }, {});

    return (
        <div className="match-list-container">
            <div className="date-navigation">
                <button onClick={handlePrevDay} className="nav-btn">&lt;</button>
                <div className="date-display" onClick={handleToday} title="Volver a hoy">
                    {formatDateForDisplay(currentDate)}
                </div>
                <button onClick={handleNextDay} className="nav-btn">&gt;</button>
            </div>

            {loading ? (
                <div className="loading">Cargando Resultados...</div>
            ) : error ? (
                <div className="error">Error: {error}</div>
            ) : matches.length === 0 ? (
                <div className="no-matches">No hay Partidos Programados para este día.</div>
            ) : (
                <div className="match-list">
                    {Object.values(groupedMatches).map((group) => (
                        <div key={group.id} className="competition-group">
                            <div className="competition-header">
                                <img src={group.emblem} alt={group.name} className="competition-logo" />
                                <h2>{group.name}</h2>
                            </div>
                            <div className="matches-grid">
                                {group.matches.map((match) => (
                                    <div key={match.id} className="match-card">
                                        <div className="match-content">
                                            <div className="team-section home">
                                                <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="team-logo" />
                                                <span className="team-name">{match.homeTeam.shortName || match.homeTeam.name}</span>
                                            </div>

                                            <div className="score-section">
                                                <div className="score-board">
                                                    {match.status === 'SCHEDULED' || match.status === 'TIMED' ? (
                                                        <span className="vs-divider">VS</span>
                                                    ) : (
                                                        <>
                                                            <span className="score">{match.score.fullTime.home ?? 0}</span>
                                                            <span className="vs-divider">:</span>
                                                            <span className="score">{match.score.fullTime.away ?? 0}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="match-meta">
                                                    <span className="status-badge">{match.status}</span>
                                                    <div className="match-time">
                                                        {new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="team-section away">
                                                <span className="team-name">{match.awayTeam.shortName || match.awayTeam.name}</span>
                                                <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="team-logo" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchList;
