import { useState, useEffect } from 'react';
import { database } from './firebase-config';
import { ref, onValue } from 'firebase/database';
import './Stats.css';

function Stats() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scansRef = ref(database, 'scans');
    const unsubscribe = onValue(scansRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const scansList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setScans(scansList.reverse()); // Show latest scans first
      } else {
        setScans([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data from Firebase: ", error);
      setLoading(false);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading data...</div>;
  }

  return (
    <div className="stats-container">
      <h2>Scanned Data History</h2>
      {scans.length > 0 ? (
        <ul className="scans-list">
          {scans.map(scan => (
            <li key={scan.id} className="scan-item">
              <p className="scan-data">{scan.data}</p>
              <p className="scan-timestamp">{new Date(scan.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data-message">No data has been saved yet.</p>
      )}
    </div>
  );
}

export default Stats;
