'use client';

import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanPage() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader', // ID of the element where scanner renders
      {
        fps: 10,
        qrbox: 250,
      },
      /* verbose */ false // <- THIS is the missing argument
    );

    scanner.render(
      async (decodedText: string, decodedResult: any) => {
        try {
          const res = await fetch(`/api/scan?code=${decodedText}`);
          const data = await res.json();
          alert(data.message);
        } catch (err) {
          alert('Scan failed.');
        }
      },
      (error: any) => {
        // Optional: Handle scan errors or log them
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch((error) => console.error('Clear error:', error));
    };
  }, []);

  return (
    <div>
      <h1 className="text-xl mb-4">Scan Ticket</h1>
      <div id="reader" style={{ width: '300px' }} />
    </div>
  );
}
