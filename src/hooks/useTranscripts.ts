import { useAppState } from "@/context/AppState";
import { useMemo, useState } from "react";

export function useTranscripts() {
  const { projects, updateSubtitle } = useAppState();
  const [query, setQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects[0]?.id ?? "",
  );
  const [editingSubtitleId, setEditingSubtitleId] = useState<string | null>(
    null,
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        `${project.title} ${project.subtitles.map((subtitle) => subtitle.text).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [projects, query],
  );

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0];

  return {
    query,
    setQuery,
    filteredProjects,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    editingSubtitleId,
    setEditingSubtitleId,
    updateSubtitle,
  };
}
