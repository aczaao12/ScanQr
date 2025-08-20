import { useState, useEffect } from 'react';
import { database } from './firebase-config';
import { ref, onValue } from 'firebase/database';

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
    return <div className="text-center text-lg mt-8">Loading data...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Scanned Data History</h2>
      {scans.length > 0 ? (
        <ul className="space-y-4">
          {scans.map(scan => (
            <li key={scan.id} className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-800 font-semibold break-all">{scan.data}</p>
              <p className="text-gray-500 text-sm mt-2">{new Date(scan.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-8">No data has been saved yet.</p>
      )}
    </div>
  );
}

export default Stats;