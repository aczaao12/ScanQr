import { useState } from 'react';
import Scanner from './Scanner';
import Stats from './Stats';
import './App.css';
import './Tabs.css';

function App() {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          Scanner
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'scanner' ? <Scanner /> : <Stats />}
      </div>
    </div>
  );
}

export default App;
