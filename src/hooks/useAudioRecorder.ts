import transcriptData from "@/data/twiTranscripts.json";
import { useEffect, useRef, useState } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(24);
  const phraseIndex = useRef(0);
  const [phrases, setPhrases] = useState<string[]>(
    transcriptData.liveStreamingPhrases.slice(0, 2),
  );

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const timer = setInterval(
      () => setElapsedSeconds((seconds) => seconds + 1),
      1000,
    );
    const transcriptTimer = setInterval(() => {
      phraseIndex.current =
        (phraseIndex.current + 1) % transcriptData.liveStreamingPhrases.length;
      setPhrases((current) => [
        ...current.slice(-2),
        transcriptData.liveStreamingPhrases[phraseIndex.current],
      ]);
    }, 4200);
    return () => {
      clearInterval(timer);
      clearInterval(transcriptTimer);
    };
  }, [isPaused, isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsPaused((paused) => !paused);
      return;
    }
    setIsRecording(true);
    setIsPaused(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  const resetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setElapsedSeconds(0);
  };

  return {
    isRecording,
    isPaused,
    elapsedSeconds,
    phrases,
    toggleRecording,
    stopRecording,
    resetRecording,
  };
}
