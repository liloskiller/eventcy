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
  const lastScannedCode = useRef<string | null>(null);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // @ts-ignore - Safari requires this legacy constructor
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    return () => {
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (!scannerContainerRef.current) return;

    const config = {
      fps: 10, 
      qrbox: { width: 200, height: 200 },
      rememberLastUsedCamera: true,
      disableFlip: true 
    };

    const scanner = new Html5Qrcode(scannerContainerRef.current.id);
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        let backCamera = cameras.find(cam => 
          cam.label.toLowerCase().includes('back') || 
          cam.label.toLowerCase().includes('rear')
        ) || cameras[0];

        if (!backCamera) throw new Error('No camera found');

        await scanner.start(
          backCamera.id,
          config,
          (decodedText) => {
            if (scanStatus !== 'ready' || (lastScannedCode.current === decodedText)) return;
            
            lastScannedCode.current = decodedText;
            handleScanSuccess(decodedText);
          },
          (error) => console.warn('Scan error:', error)
        );
        
        setScanStatus('ready');
      } catch (err) {
        console.error('Camera error:', err);
        setMessage('Camera access required. Please enable permissions.');
        setScanStatus('error');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [scanStatus]);

  const handleScanSuccess = async (decodedText: string) => {
    setScanStatus('scanning');
    
    try {
      const res = await fetch(`/api/scan?code=${decodedText}`);
      const data = await res.json();
      
      if (res.ok) {
        playBeep(800, 200); 
        setMessage(data.message || 'Ticket validated!');
        setScanStatus('success');
      } else {
        throw new Error(data.message || 'Invalid ticket');
      }
    } catch (err) {
      playBeep(200, 500); 
      setMessage(err instanceof Error ? err.message : 'Scan failed');
      setScanStatus('error');
    }
    
    cooldownTimer.current = setTimeout(() => {
      lastScannedCode.current = null;
      setScanStatus('ready');
      setMessage('');
    }, 500);
  };

  // Web Audio API solution for iOS
  const playBeep = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 0.01);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration/1000);
    oscillator.stop(audioContextRef.current.currentTime + duration/1000);
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
            
            {/* Scanner overlay with cooldown indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-4 border-blue-400 rounded-lg w-64 h-64 relative">
                {scanStatus !== 'ready' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white font-bold text-lg">
                      {scanStatus === 'scanning' ? 'Processing...' : ''}
                    </div>
                  </div>
                )}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400"></div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t">
            {scanStatus === 'success' ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <FaCheckCircle className="text-xl" />
                <span>{message}</span>
              </div>
            ) : scanStatus === 'error' ? (
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <FaTimesCircle className="text-xl" />
                <span>{message}</span>
              </div>
            ) : (
              <p className="text-center text-gray-600">
                {scanStatus === 'scanning' ? 'Processing ticket...' : 'Scan ticket QR code'}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Point camera at ticket QR code</p>
          <p className="mt-1">Hold steady for 1 second after scan</p>
        </div>
      </main>

      <footer className="bg-blue-600 text-white p-4 text-center text-sm">
        EventCy.Live © {new Date().getFullYear()}
      </footer>
    </div>
  );
}