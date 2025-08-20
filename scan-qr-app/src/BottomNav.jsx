import React from 'react';
import { BsQrCodeScan, BsBarChartLine } from 'react-icons/bs';

function BottomNav({ activeTab, setActiveTab }) {
  const buttonClasses = "flex flex-col items-center gap-1 text-white text-xs p-2";
  const activeButtonClasses = "text-blue-400";

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-gray-800 shadow-lg p-2">
      <button 
        className={`${buttonClasses} ${activeTab === 'scanner' ? activeButtonClasses : ''}`}
        onClick={() => setActiveTab('scanner')}
      >
        <BsQrCodeScan size={24} />
        <span>Scanner</span>
      </button>
      <button 
        className={`${buttonClasses} ${activeTab === 'stats' ? activeButtonClasses : ''}`}
        onClick={() => setActiveTab('stats')}
      >
        <BsBarChartLine size={24} />
        <span>Statistics</span>
      </button>
    </div>
  );
}

export default BottomNav;