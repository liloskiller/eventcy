'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaCheckCircle, FaTimesCircle, FaQrcode } from 'react-icons/fa';

type ScanStatus = 'ready' | 'scanning' | 'success' | 'error';

export default function ScanPage() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('ready');
  const [message, setMessage] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const beepSuccessRef = useRef<HTMLAudioElement | null>(null);
  const beepErrorRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sounds
  useEffect(() => {
    beepSuccessRef.current = new Audio('/sounds/beep-success.mp3');
    beepErrorRef.current = new Audio('/sounds/beep-error.mp3');
    
    return () => {
      [beepSuccessRef.current, beepErrorRef.current].forEach(audio => {
        if (audio) {
          audio.pause();
          audio.remove();
        }
      });
    };
  }, []);

  // Initialize scanner
  useEffect(() => {
    if (!scannerContainerRef.current) return;

    const config = {
      fps: 15,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true
    };

    const scanner = new Html5Qrcode(scannerContainerRef.current.id);
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        let backCamera = cameras.find(cam => 
          cam.label.toLowerCase().includes('back') || 
          cam.label.toLowerCase().includes('rear')
        );
        
        // Fallback to first camera if no back camera found
        if (!backCamera && cameras.length > 0) {
          backCamera = cameras[0];
        }

        if (!backCamera) {
          throw new Error('No camera found');
        }

        await scanner.start(
          backCamera.id,
          config,
          (decodedText) => onScanSuccess(decodedText),
          (error) => onScanError(error)
        );
        
        setScanStatus('ready');
      } catch (err) {
        console.error('Camera init error:', err);
        setMessage('Could not access camera. Please ensure permissions are granted.');
        setScanStatus('error');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (scanStatus !== 'ready') return;
    
    setScanStatus('scanning');
    
    try {
      const res = await fetch(`/api/scan?code=${decodedText}`);
      const data = await res.json();
      
      if (res.ok) {
        playSound(true);
        setMessage(data.message || 'Ticket validated!');
        setScanStatus('success');
      } else {
        throw new Error(data.message || 'Invalid ticket');
      }
    } catch (err) {
      playSound(false);
      setMessage(err instanceof Error ? err.message : 'Scan failed');
      setScanStatus('error');
    }
    
    // Auto-reset after delay
    setTimeout(() => {
      setScanStatus('ready');
      setMessage('');
    }, 2000);
  };

  const onScanError = (error: string) => {
    console.warn('Scan error:', error);
  };

  const playSound = (success: boolean) => {
    const audio = success ? beepSuccessRef.current : beepErrorRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">
          <FaQrcode className="inline mr-2" />
          Event Access Control
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative">
            <div 
              id="scanner-container" 
              ref={scannerContainerRef}
              className="w-full aspect-square bg-black relative"
            />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-4 border-blue-400 rounded-lg w-64 h-64 relative">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400"></div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t">
            {scanStatus === 'ready' && (
              <p className="text-center text-gray-600">Scan ticket QR code</p>
            )}
            
            {scanStatus === 'scanning' && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
                <span>Processing...</span>
              </div>
            )}
            
            {scanStatus === 'success' && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <FaCheckCircle className="text-xl" />
                <span>{message}</span>
              </div>
            )}
            
            {scanStatus === 'error' && (
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <FaTimesCircle className="text-xl" />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Point camera at ticket QR code</p>
          <p className="mt-1">Ensure good lighting and clear view</p>
        </div>
      </main>

      <footer className="bg-blue-600 text-white p-4 text-center text-sm">
        Event Management System © {new Date().getFullYear()}
      </footer>
    </div>
  );
}