import * as DocumentPicker from "expo-document-picker";
import {
    CheckCircle2,
    CloudUpload,
    FileAudio2,
    Info,
    MoreHorizontal,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export function UploadScreen() {
  const [fileName, setFileName] = useState("twi_podcast_ep2.mp3");
  const [progress, setProgress] = useState(72);
  const [error, setError] = useState("");

  useEffect(() => {
    if (progress >= 72) return;
    const timer = setInterval(
      () => setProgress((value) => Math.min(72, value + 8)),
      300,
    );
    return () => clearInterval(timer);
  }, [progress]);

  const chooseFile = async () => {
    setError("");
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/x-m4a",
      ],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const file = result.assets[0];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["mp3", "wav", "m4a"].includes(extension)) {
      setError("Choose an MP3, WAV, or M4A audio file.");
      return;
    }
    setFileName(file.name);
    setProgress(0);
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
        Upload Audio File
      </Text>
      <Text className="mt-3 text-[13px] text-slate-400">
        Turn your audio into editable Twi text.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Select audio file"
        onPress={chooseFile}
        className="mt-25 h-48 items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-4"
      >
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
          <CloudUpload size={22} color="#2563EB" />
        </View>
        <View className="mt-3 rounded-md bg-blue-600 px-4 py-2.5">
          <Text className="text-[12px] font-semibold text-white">
            Select audio file
          </Text>
        </View>
        <Text className="mt-2.5 text-[11px] font-medium text-slate-500">
          Supported formats: MP3, WAV, M4A
        </Text>
        <Text className="mt-1 text-[10px] text-slate-400">
          Up to 100 MB · Audio files only
        </Text>
      </Pressable>
      {error ? (
        <Text className="mt-2 text-[12px] text-red-600">{error}</Text>
      ) : null}

      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-[13px] font-medium text-slate-500">
          Transcription
        </Text>
      </View>

      <View className="mt-4 rounded-2xl border border-slate-200 p-4">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <FileAudio2 size={20} color="#2563EB" />
          </View>
          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="text-[13px] font-semibold text-slate-700"
            >
              {fileName}
            </Text>
            <Text className="mt-0.5 text-[11px] text-slate-400">
              18.4 MB · 12:48
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More file options"
            className="p-1"
          >
            <MoreHorizontal size={19} color="#94A3B8" />
          </Pressable>
        </View>
        <Text className="mt-4 text-[11px] font-semibold text-blue-600">
          {progress}% - Generating timecoded text...
        </Text>
        <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100">
          <View
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="mt-2.5 text-[11px] text-slate-500">
          Applying Twi language model and noise cancellation...
        </Text>
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <CheckCircle2 size={13} color="#2563EB" />
            <Text className="text-[10px] text-slate-400">Uploaded</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <Text className="text-[10px] font-semibold text-blue-600">
              Transcribing
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <Text className="text-[10px] text-slate-400">Ready</Text>
          </View>
        </View>
      </View>

      <View className="mt-5 flex-row items-start gap-2 px-1">
        <Info size={14} color="#94A3B8" />
        <Text className="flex-1 text-[11px] leading-5 text-slate-400">
          Keep creating while we transcribe. Your finished text will appear in
          History.
        </Text>
      </View>
      <View className="mt-10 flex-row items-center justify-center gap-2">
        <CheckCircle2 size={13} color="#94A3B8" />
        <Text className="text-[10px] text-slate-400">
          Your recordings stay private.
        </Text>
      </View>
    </ScrollView>
  );
}
