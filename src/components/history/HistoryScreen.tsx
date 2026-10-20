import { Waveform } from "@/components/common/Waveform";
import { useTranscripts } from "@/hooks/useTranscripts";
import { exportSrt } from "@/utils/exportSrt";
import * as ClipboardAPI from "expo-clipboard";
import {
    Check,
    ChevronRight,
    Clipboard,
    FileAudio2,
    FolderClock,
    Pause,
    Play,
    Search,
    X,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export function HistoryScreen() {
  const {
    query,
    setQuery,
    filteredProjects,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    editingSubtitleId,
    setEditingSubtitleId,
    updateSubtitle,
  } = useTranscripts();
  const [playing, setPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0.36);
  const [speed, setSpeed] = useState<"1x" | "1.5x">("1x");
  const [notice, setNotice] = useState("");

  const showNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 1800);
  };

  const copyText = async () => {
    if (!selectedProject) return;
    await ClipboardAPI.setStringAsync(
      selectedProject.subtitles.map((subtitle) => subtitle.text).join("\n"),
    );
    showNotice("Transcript copied");
  };

  const saveSrt = async () => {
    if (!selectedProject) return;
    try {
      await exportSrt(selectedProject);
      showNotice("SRT file exported");
    } catch {
      showNotice("Could not export subtitle file");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 22,
      }}
    >
      <Text className="text-[22px] font-semibold text-slate-900">
        Transcriptions & Projects
      </Text>
      <Text className="mt-3 text-[13px] text-slate-400">
        Your recordings, ready for the next cut.
      </Text>

      <View className="mt-15 h-11 flex-row items-center rounded-lg bg-slate-50 px-3">
        <Search size={17} color="#94A3B8" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search recordings & text..."
          placeholderTextColor="#94A3B8"
          accessibilityLabel="Search recordings and transcript text"
          className="ml-2 flex-1 text-[12px] text-slate-700"
        />
        {query ? (
          <Pressable
            onPress={() => setQuery("")}
            accessibilityLabel="Clear search"
          >
            <X size={16} color="#94A3B8" />
          </Pressable>
        ) : null}
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold text-slate-500">
          Recent projects
        </Text>
        <Text className="text-[10px] text-slate-400">
          {filteredProjects.length} projects
        </Text>
      </View>
      <View className="mt-2 gap-2">
        {filteredProjects.map((project) => {
          const active =
            (selectedProject?.id ?? selectedProjectId) === project.id;
          return (
            <Pressable
              key={project.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${project.title}`}
              onPress={() => setSelectedProjectId(project.id)}
              className={`min-h-[60px] flex-row items-center gap-2.5 rounded-xl border px-3 py-2 ${active ? "border-blue-200 bg-blue-50" : "border-slate-100 bg-white"}`}
            >
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-white">
                <FileAudio2 size={17} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text
                  numberOfLines={1}
                  className="text-[11px] font-semibold text-slate-700"
                >
                  {project.title}
                </Text>
                <Text className="mt-1 text-[9px] text-slate-400">
                  {project.duration} · {project.date}
                </Text>
              </View>
              <View className="rounded-full bg-white px-2 py-1">
                <Text className="text-[9px] font-semibold text-blue-600">
                  {project.language}
                </Text>
              </View>
              {active ? (
                <Check size={14} color="#2563EB" />
              ) : (
                <ChevronRight size={15} color="#94A3B8" />
              )}
            </Pressable>
          );
        })}
        {filteredProjects.length === 0 ? (
          <View className="items-center rounded-xl border border-slate-100 py-5">
            <FolderClock size={20} color="#94A3B8" />
            <Text className="mt-2 text-[12px] text-slate-400">
              No matching recordings
            </Text>
          </View>
        ) : null}
      </View>

      {selectedProject ? (
        <>
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-[14px] font-semibold text-slate-700">
              Subtitle editor
            </Text>
            <View className="flex-row items-center gap-1 rounded-full bg-blue-50 px-2 py-1">
              <Check size={11} color="#2563EB" />
              <Text className="text-[9px] font-semibold text-blue-600">
                Saved
              </Text>
            </View>
          </View>
          <View className="mt-2 rounded-2xl bg-slate-50 p-3">
            <View className="flex-row items-center gap-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={playing ? "Pause audio" : "Play audio"}
                onPress={() => setPlaying((value) => !value)}
                className="h-9 w-9 items-center justify-center rounded-full bg-blue-600"
              >
                {playing ? (
                  <Pause size={15} color="white" fill="white" />
                ) : (
                  <Play size={15} color="white" fill="white" />
                )}
              </Pressable>
              <View className="flex-1">
                <Waveform compact progress={playProgress} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Change playback speed"
                onPress={() =>
                  setSpeed((value) => (value === "1x" ? "1.5x" : "1x"))
                }
                className="px-1"
              >
                <Text className="text-[10px] font-semibold text-slate-500">
                  {speed}
                </Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="adjustable"
              accessibilityLabel="Audio scrubber"
              onPress={() =>
                setPlayProgress((value) => (value >= 0.8 ? 0.16 : value + 0.2))
              }
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"
            >
              <View
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${playProgress * 100}%` }}
              />
            </Pressable>
            <View className="mt-1 flex-row justify-between">
              <Text className="text-[9px] font-medium text-blue-600">
                01:12
              </Text>
              <Text className="text-[9px] text-slate-400">
                {selectedProject.duration}
              </Text>
            </View>
          </View>

          <View className="mt-3 gap-2">
            {selectedProject.subtitles.map((subtitle) => {
              const editing = editingSubtitleId === subtitle.id;
              return (
                <Pressable
                  key={subtitle.id}
                  onPress={() => setEditingSubtitleId(subtitle.id)}
                  className={`rounded-xl border px-3 py-2 ${editing ? "border-blue-400 bg-blue-50" : "border-slate-100 bg-white"}`}
                >
                  <View className="mb-1.5 flex-row items-center justify-between">
                    <Text className="text-[9px] font-medium text-slate-400">
                      {subtitle.timestamp}
                    </Text>
                    {editing ? (
                      <View className="flex-row items-center gap-1">
                        <Check size={10} color="#2563EB" />
                        <Text className="text-[8px] font-bold text-blue-600">
                          EDITING
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  {editing ? (
                    <TextInput
                      autoFocus
                      multiline
                      value={subtitle.text}
                      onChangeText={(text) =>
                        updateSubtitle(selectedProject.id, subtitle.id, text)
                      }
                      onBlur={() => setEditingSubtitleId(null)}
                      accessibilityLabel={`Edit subtitle at ${subtitle.timestamp}`}
                      className="min-h-9 text-[12px] leading-5 text-slate-700"
                    />
                  ) : (
                    <Text className="text-[12px] leading-5 text-slate-700">
                      {subtitle.text}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
          <Text className="mt-2 text-[9px] text-slate-400">
            Tap a subtitle to correct Twi in local spellings.
          </Text>

          <View className="mt-5 flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Export SRT subtitles"
              onPress={saveSrt}
              className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-blue-600"
            >
              <Check size={14} color="white" />
              <Text className="text-[12px] font-semibold text-white">
                Export .SRT
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copy transcript text"
              onPress={copyText}
              className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-md border border-slate-200 bg-white"
            >
              <Clipboard size={15} color="#64748B" />
              <Text className="text-[12px] font-semibold text-slate-700">
                Copy Text
              </Text>
            </Pressable>
          </View>
          {notice ? (
            <Text
              accessibilityLiveRegion="polite"
              className="mt-2 text-center text-[11px] font-medium text-blue-600"
            >
              {notice}
            </Text>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
}
