import React from 'react';
import MatchList from './components/MatchList';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>⚽ Live Scores</h1>
      </header>
      <main>
        <MatchList />
      </main>
    </div>
  );
}

export default App;
