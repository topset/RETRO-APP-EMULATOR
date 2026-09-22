import React, { useState } from 'react';
import { getCoverArtUrl } from '../utils/coverArt';
import { Gamepad2, Image as ImageIcon } from 'lucide-react';

interface GameCoverProps {
  consoleId: string;
  romName: string;
  localCoverUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GameCover: React.FC<GameCoverProps> = ({
  consoleId,
  romName,
  localCoverUrl,
  size = 'md',
  className = '',
}) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initialUrl = getCoverArtUrl(consoleId, romName, localCoverUrl);

  const sizeClasses = {
    sm: 'w-10 h-14 rounded-md',
    md: 'w-16 h-22 rounded-lg',
    lg: 'w-36 h-48 rounded-xl',
  }[size];

  if (!initialUrl || loadFailed) {
    return (
      <div
        className={`${sizeClasses} bg-slate-800 border border-slate-700/80 flex flex-col items-center justify-center p-1 text-slate-500 shadow-inner select-none ${className}`}
      >
        <Gamepad2 className={size === 'lg' ? 'w-10 h-10 mb-1 opacity-40' : 'w-5 h-5 opacity-40'} />
        {size === 'lg' && (
          <span className="text-[10px] text-center font-mono text-slate-400 line-clamp-2 px-1">
            {romName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-slate-900 border border-slate-700/70 shadow-md transition-transform group-hover:scale-[1.02] ${sizeClasses} ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-slate-500 opacity-50" />
        </div>
      )}
      <img
        src={initialUrl}
        alt={`Carátula de ${romName}`}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setLoadFailed(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
