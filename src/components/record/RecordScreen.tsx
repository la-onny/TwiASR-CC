import { Waveform } from "@/components/common/Waveform";
import { useAppState, type Project } from "@/context/AppState";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Check, Mic2, Pause, Play, Square } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

function timeLabel(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function RecordScreen() {
  const recorder = useAudioRecorder();
  const { addProject } = useAppState();
  const [saved, setSaved] = useState(false);

  const saveRecording = () => {
    recorder.stopRecording();
    const duration = timeLabel(recorder.elapsedSeconds);
    const project: Project = {
      id: `recording-${Date.now()}`,
      title: `Twi_Recording_${new Date().toLocaleDateString("en-GB").replaceAll("/", "-")}.mp3`,
      duration,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      language: "Twi",
      subtitles: recorder.phrases.map((text, index) => ({
        id: `new-${Date.now()}-${index}`,
        timestamp: `00:${String(Math.max(0, recorder.elapsedSeconds - (recorder.phrases.length - index) * 3)).padStart(2, "0")}:00`,
        text,
      })),
    };
    addProject(project);
    recorder.resetRecording();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 32,
        paddingTop: 22,
      }}
    >
      <Text className="text-[25px] font-semibold text-slate-900">
        Record Twi Audio
      </Text>
      <Text className="mt-3 text-[13px] text-slate-400">
        Your voice. Your language. In writing.
      </Text>
      <View className="mt-26 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View
            className={`h-2 w-2 rounded-full ${recorder.isRecording && !recorder.isPaused ? "bg-blue-600" : "bg-slate-300"}`}
          />
          <Text className="text-[11px] font-medium text-slate-500">
            {recorder.isRecording
              ? recorder.isPaused
                ? "Paused"
                : "Recording"
              : "Press to start recording"}
          </Text>
        </View>
      </View>

      <View className="mt-7 items-center">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-blue-50">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              recorder.isRecording ? "Recording active" : "Start recording"
            }
            onPress={recorder.toggleRecording}
            className={`h-20 w-20 items-center justify-center rounded-full ${recorder.isRecording ? "bg-blue-700" : "bg-blue-600"}`}
          >
            <Mic2 size={31} color="white" strokeWidth={1.8} />
          </Pressable>
        </View>
        <Text className="mt-3 text-[30px] font-semibold tabular-nums text-slate-900">
          {timeLabel(recorder.elapsedSeconds)}
        </Text>
        <View className="mt-3 w-full px-1">
          <Waveform progress={recorder.isRecording ? 0.75 : 0.48} />
        </View>
      </View>

      <View className="mt-5 rounded-2xl bg-slate-50 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[14px] font-semibold text-slate-700">
            Live Transcript Preview
          </Text>
          <View className="h-2 w-2 rounded-full bg-emerald-500" />
        </View>

        <View className="mt-3 gap-3">
          {recorder.phrases.map((phrase, index) => (
            <Text
              key={`${index}-${phrase}`}
              className={`text-[14px] leading-6 ${index === recorder.phrases.length - 1 ? "font-medium text-slate-700" : "text-slate-400"}`}
            >
              {phrase}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-7">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            recorder.isPaused ? "Resume recording" : "Pause recording"
          }
          onPress={recorder.toggleRecording}
          className="h-12 w-12 items-center justify-center rounded-full bg-slate-50"
        >
          {recorder.isPaused ? (
            <Play size={19} color="#64748B" />
          ) : (
            <Pause size={19} color="#64748B" />
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            recorder.isRecording ? "Stop recording" : "Start recording"
          }
          onPress={
            recorder.isRecording
              ? recorder.stopRecording
              : recorder.toggleRecording
          }
          className="h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-blue-600 bg-white"
        >
          {recorder.isRecording ? (
            <Square size={20} color="#2563EB" fill="#2563EB" />
          ) : (
            <View className="h-10 w-10 rounded-full bg-blue-600" />
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save recording to history"
          onPress={saveRecording}
          className="h-12 w-12 items-center justify-center rounded-full bg-blue-50"
        >
          <Check size={20} color="#2563EB" strokeWidth={2.5} />
        </Pressable>
      </View>
      <Text className="mt-3 text-center text-[11px] text-slate-400">
        {saved
          ? "Recording saved to History"
          : "Pause anytime · Tap to stop & save"}
      </Text>
    </ScrollView>
  );
}
