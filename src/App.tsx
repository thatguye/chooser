/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { StartScreen } from './components/StartScreen';
import { ChooserAudio } from './game/audio';

function hasAutostartParam(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('autostart') === '1';
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(hasAutostartParam);
  const [mountStartScreen, setMountStartScreen] = useState<boolean>(() => !hasAutostartParam());
  const audioRef = useRef<ChooserAudio | null>(null);

  if (!audioRef.current) {
    audioRef.current = new ChooserAudio();
  }

  useEffect(() => {
    document.body.dataset.state = isPlaying ? 'playing' : 'title';
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      setMountStartScreen(false);
    }, 320);
    return () => window.clearTimeout(timer);
  }, [isPlaying]);

  const handlePlay = useCallback(() => {
    audioRef.current?.unlock();
    document.body.dataset.state = 'playing';
    setIsPlaying(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#07070A]">
      <GameCanvas active={isPlaying} audio={audioRef.current} />
      {mountStartScreen && <StartScreen visible={!isPlaying} onPlay={handlePlay} />}
    </div>
  );
}
