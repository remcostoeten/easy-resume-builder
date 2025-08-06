import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpacebarTriple() {
  const timestampsRef = useRef<readonly number[]>([]);
  const [isTriggered, setIsTriggered] = useState(false);

  const handleKeyDown = useCallback(function(event: KeyboardEvent) {
    if (event.code !== 'Space') {
      return;
    }

    const currentTime = Date.now();
    const currentTimestamps = timestampsRef.current;
    
    const updatedTimestamps = [...currentTimestamps, currentTime].slice(-3);
    timestampsRef.current = updatedTimestamps;

    if (updatedTimestamps.length === 3) {
      const timeSpan = updatedTimestamps[2] - updatedTimestamps[0];
      
      if (timeSpan <= 600) {
        setIsTriggered(true);
        timestampsRef.current = [];
      }
    }
  }, []);

  useEffect(function() {
    window.addEventListener('keydown', handleKeyDown);

    function cleanup() {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return cleanup;
  }, [handleKeyDown]);

  function resetTriggered() {
    setIsTriggered(false);
  }

  return { isTriggered, resetTriggered };
}