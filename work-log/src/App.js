import React, { useState } from 'react';
import './App.css';

function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleButtonClick = () => {
    const currentTime = new Date();
    console.log(`Button pressed at: ${currentTime}`);

    if (!isWorking) {
      const newLog = {
        start: currentTime.toLocaleString(),
        stop: '',
        duration: ''
      };
      setLogs([...logs, newLog]);
      setStartTime(currentTime);
    } else {
      const durationMs = currentTime - startTime;
      const durationSeconds = Math.round(durationMs / 1000);
      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      const seconds = durationSeconds % 60;
      const formattedDuration = `${hours}:${minutes}:${seconds}`;

      const updatedLogs = logs.map((log, index) => {
        if (index === logs.length - 1) {
          return {
            ...log,
            stop: currentTime.toLocaleString(),
            duration: formattedDuration
          };
        }
        return log;
      });

      setLogs(updatedLogs);
    }

    setIsWorking(!isWorking);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleButtonClick}>
          {isWorking ? 'Stop Work' : 'Start Work'}
        </button>
        <table className="fixed-width-table">
          <thead>
            <tr>
              <th>Work Start</th>
              <th>Work Stop</th>
              <th>Duration (hh:mm:ss)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.start}</td>
                <td>{log.stop}</td>
                <td>{log.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;