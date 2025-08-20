import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { database } from './firebase-config';
import { ref, push, set } from 'firebase/database';

const NOTIFICATION_TIMEOUT = 3500; // 3.5 seconds

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [showScanner, setShowScanner] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const showNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
    }, NOTIFICATION_TIMEOUT);
  };

  const stopCamera = async () => {
    if (isCameraRunning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsCameraRunning(false);
      } catch (err) {
        console.error("Error stopping camera: ", err);
      }
    }
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    setScanResult(decodedText);
    setShowScanner(false);
    await stopCamera();

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

  const startCamera = () => {
    if (!isCameraRunning) {
      html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      ).then(() => {
        setIsCameraRunning(true);
      }).catch(err => {
        showNotification("Error starting camera: " + err);
      });
    }
  };

  useEffect(() => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader");
    }

    if (showScanner && !showManualInput && !isCameraRunning) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [showScanner, showManualInput, isCameraRunning]);

  const handleScanAgain = () => {
    setScanResult(null);
    setShowScanner(true);
    setShowManualInput(false);
    setNotificationMessage(null);
  };

  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await stopCamera();
      html5QrCodeRef.current.scanFile(file, true)
        .then(decodedText => {
          onScanSuccess(decodedText);
        })
        .catch(err => {
          showNotification("Error scanning file: " + err);
        });
    }
  };

  const handleManualInputChange = (e) => {
    setManualInput(e.target.value);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim() !== '') {
      onScanSuccess(manualInput);
    }
  };

  const handleManualInputClick = async () => {
    await stopCamera();
    setShowManualInput(true);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen">
      {showScanner ? (
        showManualInput ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-md p-5">
            <textarea 
              className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-y bg-white text-black"
              placeholder="Enter QR code data..."
              value={manualInput}
              onChange={handleManualInputChange}
            />
            <button className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 transition-colors" onClick={handleManualSubmit}>Submit</button>
            <a href="#" className="text-sm text-gray-400 underline mt-2" onClick={() => setShowManualInput(false)}>Back to Scanner</a>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div id="reader" className="absolute top-0 left-0 w-full h-full"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
            <div className="relative w-64 h-64">
            </div>
            <p className="absolute bottom-24 text-white text-lg bg-black bg-opacity-50 px-4 py-2 rounded-full">Hướng camera vào mã QR</p>
            <div className="absolute bottom-5 flex flex-col gap-4 items-center">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileScan} className="hidden" />
              <button className="border border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-colors" onClick={() => fileInputRef.current.click()}>Quét từ một tệp ảnh</button>
              <a href="#" className="text-sm text-gray-300 underline" onClick={handleManualInputClick}>Nhập mã thủ công</a>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center gap-5 w-full max-w-md p-5">
          <div className="bg-white p-6 rounded-lg shadow-md w-full text-center">
            <p className="text-lg text-gray-600">Scanned Data:</p>
            <p className="text-2xl font-bold text-blue-600 break-words">{scanResult}</p>
          </div>
          <button onClick={handleScanAgain} className="w-full bg-blue-500 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-600 transition-colors">Scan New QR</button>
        </div>
      )}

      {notificationMessage && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${notificationMessage.includes("Error") ? 'bg-red-500' : 'bg-green-500'}`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
}

export default Scanner;
