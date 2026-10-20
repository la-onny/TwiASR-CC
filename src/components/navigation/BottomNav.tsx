import { FolderClock, Mic2, Upload } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export type TabName = "record" | "upload" | "history";

const tabs = [
  { id: "record", label: "Record", Icon: Mic2 },
  { id: "upload", label: "Upload", Icon: Upload },
  { id: "history", label: "History", Icon: FolderClock },
] as const;

export function BottomNav({
  activeTab,
  onChange,
}: {
  activeTab: TabName;
  onChange: (tab: TabName) => void;
}) {
  return (
    <View className="border-t border-slate-100 bg-white px-4 pb-2 pt-2">
      <View className="h-14 flex-row items-center justify-around">
        {tabs.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${label} tab`}
              onPress={() => onChange(id)}
              className="h-12 min-w-20 items-center justify-center gap-1"
            >
              <View
                className={`h-7 w-12 items-center justify-center rounded-full ${active ? "bg-blue-50" : "bg-transparent"}`}
              >
                <Icon
                  size={19}
                  color={active ? "#2563EB" : "#94A3B8"}
                  strokeWidth={2}
                />
              </View>
              <Text
                className={`text-[10px] font-semibold ${active ? "text-blue-600" : "text-slate-400"}`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View className="mt-1 h-1 w-28 self-center rounded-full bg-slate-900" />
    </View>
  );
}
