import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './App.css';

function App() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrCodeSuccessCallback: (decodedText, decodedResult) => {
          setScanResult(decodedText);
          scanner.clear(); // Stop scanning after a successful scan
        },
        qrCodeErrorCallback: (errorMessage) => {
          // console.error("QR Code Error:", errorMessage);
        },
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false // verbose
    );

    scanner.render();

    return () => {
      scanner.clear().catch(error => {
        // console.error("Failed to clear html5QrcodeScanner", error);
      });
    };
  }, []);

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>
      {scanResult ? (
        <div className="scan-result">
          <p>Scanned Data:</p>
          <p className="result-text">{scanResult}</p>
        </div>
      ) : (
        <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}></div>
      )}
    </div>
  );
}

export default App;