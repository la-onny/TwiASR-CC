import { HistoryScreen } from "@/components/history/HistoryScreen";
import { BottomNav, type TabName } from "@/components/navigation/BottomNav";
import { RecordScreen } from "@/components/record/RecordScreen";
import { UploadScreen } from "@/components/upload/UploadScreen";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabName>("record");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top", "left", "right"]}
    >
      <StatusBar style="dark" />
      <View className="flex-1 overflow-hidden bg-white">
        <View className="flex-1">
          {activeTab === "record" ? <RecordScreen /> : null}
          {activeTab === "upload" ? <UploadScreen /> : null}
          {activeTab === "history" ? <HistoryScreen /> : null}
        </View>
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}
