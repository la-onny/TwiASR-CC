import type { Project } from "@/context/AppState";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

function toSrtTimestamp(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},000`;
}

function parseTimestamp(timestamp: string) {
  return timestamp
    .split(":")
    .reduce((total, part) => total * 60 + Number(part), 0);
}

export function buildSrt(project: Project) {
  return project.subtitles
    .map((subtitle, index) => {
      const startSeconds = parseTimestamp(subtitle.timestamp);
      const start = toSrtTimestamp(startSeconds);
      const end = toSrtTimestamp(startSeconds + 3);
      return `${index + 1}\n${start} --> ${end}\n${subtitle.text}`;
    })
    .join("\n\n");
}

export async function exportSrt(project: Project) {
  const contents = buildSrt(project);
  const fileName = `${project.title.replace(/\.[^.]+$/, "")}.srt`;

  if (Platform.OS === "web") {
    const blob = new Blob([contents], { type: "text/srt;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true });
  file.write(contents);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "application/x-subrip",
      dialogTitle: "Export subtitles",
    });
  }
}
