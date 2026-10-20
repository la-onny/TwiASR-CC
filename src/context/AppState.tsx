import transcriptData from "@/data/twiTranscripts.json";
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Subtitle = {
  id: string;
  timestamp: string;
  text: string;
};

export type Project = {
  id: string;
  title: string;
  duration: string;
  date: string;
  language: string;
  subtitles: Subtitle[];
};

type AppStateValue = {
  projects: Project[];
  addProject: (project: Project) => void;
  updateSubtitle: (projectId: string, subtitleId: string, text: string) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(
    transcriptData.mockProjects,
  );

  const value = useMemo<AppStateValue>(
    () => ({
      projects,
      addProject: (project) => setProjects((current) => [project, ...current]),
      updateSubtitle: (projectId, subtitleId, text) =>
        setProjects((current) =>
          current.map((project) =>
            project.id !== projectId
              ? project
              : {
                  ...project,
                  subtitles: project.subtitles.map((subtitle) =>
                    subtitle.id === subtitleId
                      ? { ...subtitle, text }
                      : subtitle,
                  ),
                },
          ),
        ),
    }),
    [projects],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context)
    throw new Error("useAppState must be used inside AppStateProvider");
  return context;
}
