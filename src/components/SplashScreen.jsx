import React, { useEffect, useState } from 'react';
import { Code, Loader2 } from 'lucide-react';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState('Initialisation');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadingTexts = [
      'Initialisation',
      'Chargement des données',
      'Préparation de l\'interface',
      'Code Wallet est prêt !'
    ];

    let currentIndex = 0;
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentIndex]);
    }, 1000);

    // Calculer l'incrément pour atteindre 100% en ~4.5 secondes
    const progressIncrement = 100 / (4500 / 16); // 16ms est approximativement 60fps
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + progressIncrement;
        return next >= 100 ? 100 : next;
      });
    }, 16);

    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(-45deg, #1a1a1a, #2d3748, #1e40af, #312e81)',
          backgroundSize: '400% 400%',
          animation: 'gradientFlow 15s ease infinite'
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div 
        className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl space-y-8 z-10"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
        }}
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div 
              className="p-4 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(59,130,246,0.5), rgba(147,51,234,0.5))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite'
              }}
            >
              <Code className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 
            className="text-4xl font-bold text-white"
            style={{ 
              background: 'linear-gradient(90deg, #fff, #94a3b8, #fff)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Code Wallet
          </h1>
          <p className="text-gray-300">
            Votre bibliothèque de code personnelle
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 
              className="w-6 h-6 text-blue-400" 
              style={{ animation: 'gentleSpin 2s linear infinite' }} 
            />
            <span className="text-gray-300 font-medium">{loadingText}</span>
          </div>
          
          <div className="relative w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(59,130,246,0.5), rgba(147,51,234,0.5))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite'
              }}
            />
          </div>
          <p className="text-center text-sm text-gray-300">
            {Math.round(progress)}%
          </p>
        </div>

        <div className="text-center space-y-2">
          <a
            href="https://www.canva.com/design/DAGgyQbbbkk/rhnef6RUonrNJBP0fv5ZIA/view"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
          >
            digital service
          </a>
          <p className="text-gray-400 text-sm">par christian ondiyo</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;