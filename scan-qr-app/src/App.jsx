import { useState } from 'react';
import Scanner from './Scanner';
import Stats from './Stats';
import BottomNav from './BottomNav';

function App() {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="pb-16">
        {activeTab === 'scanner' ? <Scanner /> : <Stats />}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;