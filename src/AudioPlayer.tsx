import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1); // Default volume is set to 1 (maximum)

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        const value = (audio.currentTime / audio.duration) * 100;
        setProgress(Number(value.toFixed(2)));
      };
      const setAudioData = () => {
        setDuration(audio.duration);
      };
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', setAudioData);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('loadedmetadata', setAudioData);
      };
    }
  }, []);

  const handleProgressChange = (e) => {
    const value = Number(e.target.value);
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * duration;
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    if (audioRef.current) {
      audioRef.current.src = url;
      setProgress(0);
    }
  };

  const handleVolumeChange = (e) => {
    const value = e.target.value;
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={playAudio}>Play</button>
      <button onClick={pauseAudio}>Pause</button>
      <button onClick={stopAudio}>Stop</button>
      <audio ref={audioRef} />

      <p>
        Progress:{progress}%
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
        />
      </p>

      <p>
        Volume:
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </p>
    </div>
  );
};

export default AudioPlayer;
