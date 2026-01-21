import React, { useState, useEffect } from 'react';
import { Text } from 'ink';
import { getSpinnerFrames, getSpinnerInterval } from './spinner.js';

export const Spinner: React.FC = () => {
  const frames = getSpinnerFrames('dots');
  const interval = getSpinnerInterval('dots');
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % frames.length);
    }, interval);
    return () => clearInterval(timer);
  }, [frames, interval]);

  return <Text color="green">{frames[frame]}</Text>;
};
