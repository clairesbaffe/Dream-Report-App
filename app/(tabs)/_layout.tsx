import React from "react";
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import ResetAllDreams from "@/components/DeleteDreams";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Record a dream",
          tabBarIcon: ({ color }) => <AntDesign name="cloudo" size={24} color={ color } />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Dream history",
          tabBarIcon: ({ color }) => <FontAwesome5 name="history" size={24} color={ color } />,
          headerRight: () => (
            <ResetAllDreams visible={true} resetAll={true} dreamId={-1} buttonTitle="Reset all dreams" dialogTitle="Are you sure ?" dialogText="This operation is irreversible, do you really want to reset all your dreams ?" />
          ),
        }}
      />
    </Tabs>
  );
}