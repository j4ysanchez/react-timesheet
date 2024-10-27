import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    setLogs(storedLogs);
  }, []);

  const handleButtonClick = () => {
    const currentTime = new Date();
    const currentTimeUTC = currentTime.toISOString(); // Store in UTC
    console.log(`Button pressed at: ${currentTimeUTC}`);

    if (!isWorking) {
      const newLog = {
        start: currentTimeUTC,
        stop: '',
        duration: ''
      };
      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
      localStorage.setItem('workLogs', JSON.stringify(updatedLogs));
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
            stop: currentTimeUTC,
            duration: formattedDuration
          };
        }
        return log;
      });

      setLogs(updatedLogs);
      localStorage.setItem('workLogs', JSON.stringify(updatedLogs));
    }

    setIsWorking(!isWorking);
  };

  const handleClearLogs = () => {
    localStorage.removeItem('workLogs');
    setLogs([]);
  };

  const formatToLocaleString = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleString();
  };

  return (
    <div className="App">
      <header className="
      App-header">
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
                <td>{log.start ? formatToLocaleString(log.start) : ''}</td>
                <td>{log.stop ? formatToLocaleString(log.stop) : ''}</td>
                <td>{log.duration}</td>
              </tr>
            ))}

          </tbody>
        </table>        
        <button onClick={handleClearLogs}>
          Clear Logs
        </button>
      </header>
    </div>
  );
}

export default App;