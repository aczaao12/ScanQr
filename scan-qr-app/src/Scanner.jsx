import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { database } from './firebase-config';
import { ref, push, set } from 'firebase/database';
import './App.css';

const NOTIFICATION_TIMEOUT = 3500; // 3.5 seconds

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [showScanner, setShowScanner] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const scannerRef = useRef(null);

  const showNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
    }, NOTIFICATION_TIMEOUT);
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    setScanResult(decodedText);
    setShowScanner(false); // Hide scanner after successful scan

    // Save to Firebase Realtime Database
    const scansRef = ref(database, 'scans');
    const newScanRef = push(scansRef);
    set(newScanRef, {
      data: decodedText,
      timestamp: new Date().toISOString()
    }).then(() => {
      console.log("Data saved to Firebase successfully!");
      showNotification("Data saved successfully!");
    }).catch((error) => {
      console.error("Error saving data to Firebase: ", error);
      showNotification("Error saving data!");
    });
  };

  const onScanFailure = (errorMessage) => {
    // ignore scan failure
  };

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false // verbose
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner; // Store the new scanner instance in the ref
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner on unmount:", error);
        });
        scannerRef.current = null; // Clear the ref
      }
    };
  }, [showScanner]); // Re-run effect when showScanner changes

  const handleScanAgain = () => {
    console.log("Resetting scanner for new scan...");
    setScanResult(null);
    setShowScanner(true);
    setNotificationMessage(null); // Clear notification when scanning again
  };

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>
      {notificationMessage && (
        <div className={`notification-message ${notificationMessage.includes("Error") ? 'error' : ''}`}>
          {notificationMessage}
        </div>
      )}
      {showScanner ? (
        <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}></div>
      ) : (
        <div className="scan-result-container">
          <div className="scan-result">
            <p>Scanned Data:</p>
            <p className="result-text">{scanResult}</p>
          </div>
          <button onClick={handleScanAgain} className="scan-again-button">
            Scan New QR
          </button>
        </div>
      )}
    </div>
  );
}

export default Scanner;
