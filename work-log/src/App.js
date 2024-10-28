import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState(null); // State to store the current unique ID

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    setLogs(storedLogs);
  }, []);

  const handleButtonClick = () => {
    const currentTime = new Date();
    const currentTimeUTC = currentTime.toISOString(); // Store in UTC
    console.log(`Button pressed at: ${currentTimeUTC}`);

    let newLog;
    if (!isWorking) {
      const id = uuidv4(); // Generate a unique ID
      newLog = {
        id,
        workType: 'start',
        timestamp: currentTimeUTC,
        duration: null
      };
      setStartTime(currentTime);
      setCurrentId(id); // Store the current ID
    } else {
      const durationMs = currentTime - startTime;
      const durationSeconds = Math.round(durationMs / 1000);
      const hours = Math.floor(durationSeconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((durationSeconds % 3600) / 60).toString().padStart(2, '0');
      const seconds = (durationSeconds % 60).toString().padStart(2, '0');
      const formattedDuration = `${hours}:${minutes}:${seconds}`;

      newLog = {
        id: currentId, // Use the current ID
        workType: 'stop',
        timestamp: currentTimeUTC,
        duration: formattedDuration
      };
    }

    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem('workLogs', JSON.stringify(updatedLogs));

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
      <header className="App-header">
        <button
          onClick={handleButtonClick}
          className={`action-button ${isWorking ? 'stop-button' : 'start-button'}`}
        >
          {isWorking ? 'Stop Work' : 'Start Work'}
        </button>
        <table className="fixed-width-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Work Type</th>
              <th>Timestamp (Local)</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log.id} className={log.workType === 'start' ? 'start-log' : ''}>
                <td>{log.id.slice(-5)}</td>
                <td>{log.workType}</td>
                <td>{formatToLocaleString(log.timestamp)}</td>
                <td>{log.duration || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleClearLogs} className="action-button clear-button">
          Clear Logs
        </button>
      </header>
    </div>
  );
}

export default App;