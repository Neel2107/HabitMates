import { StatusBar } from 'expo-status-bar';
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View

      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar style="inverted" />
      <Text
        className="text-2xl "
      >Edit app/index.tsx to edit this screen.</Text>

    </View>
  );
}