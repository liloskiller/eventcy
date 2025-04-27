'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanPage() {
  const [scanning, setScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState('');

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    const successHandler = async (decodedText: string) => {
      // Skip if we just scanned this code
      if (lastScanned === decodedText) return;
      
      setLastScanned(decodedText);
      
      try {
        const res = await fetch(`/api/scan?code=${decodedText}`);
        const data = await res.json();
        
        alert(data.message);
        
        // Pause scanning temporarily after successful scan
        setScanning(false);
        setTimeout(() => {
          setScanning(true);
          setLastScanned('');
        }, 500); // Resume after 3 seconds
      } catch (err) {
        alert('Scan failed. Please try again.');
        setLastScanned(''); // Allow rescan on error
      }
    };

    const errorHandler = (error: any) => {
      console.warn('Scan error:', error);
    };

    scanner.render(successHandler, errorHandler);

    return () => {
      scanner.clear().catch(error => console.error('Scanner cleanup error:', error));
    };
  }, [scanning, lastScanned]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Scan Ticket</h1>
      <div id="reader" className="mx-auto" style={{ width: '300px' }} />
      {!scanning && (
        <p className="mt-4 text-center text-gray-600">
          Scanner paused. Will resume shortly...
        </p>
      )}
    </div>
  );
}