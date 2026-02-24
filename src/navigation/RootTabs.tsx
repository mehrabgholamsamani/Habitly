import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Pressable, Platform } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import MeditationScreen from "../screens/MeditationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useTheme } from "../theme/ThemeProvider";
import { HomeIcon, LibraryIcon, PlayIcon, ProfileIcon } from "../components/Icons";
import { spacing } from "../theme/spacing";

const Tab = createBottomTabNavigator();

function TabBar({ state, descriptors, navigation }: any) {
  const { colors } = useTheme();
  const base = {
    position: "absolute" as const,
    left: 16,
    right: 16,
    bottom: spacing.tabBarInset,
    height: spacing.tabBarHeight,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(45,110,110,0.10)",
    paddingHorizontal: 12,
    paddingVertical: spacing.tabBarPadY,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  };

  const webShadow = Platform.OS === "web" ? { boxShadow: "0px 14px 30px rgba(0,0,0,0.10)" } : {};
  const nativeShadow =
    Platform.OS === "web"
      ? {}
      : {
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
        };

  return (
    <View style={{ ...base, ...(webShadow as any), ...(nativeShadow as any) }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        const onLongPress = () => navigation.emit({ type: "tabLongPress", target: route.key });

        const color = isFocused ? colors.primary : "rgba(20,40,40,0.45)";
        const Icon =
          route.name === "Home"
            ? HomeIcon
            : route.name === "Library"
              ? LibraryIcon
              : route.name === "Meditation"
                ? PlayIcon
                : ProfileIcon;

        const isCenter = route.name === "Meditation";

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => ({
              flex: 1,
              height: spacing.tabBarRow,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              style={{
                width: isCenter ? 52 : 44,
                height: isCenter ? 52 : 44,
                borderRadius: isCenter ? 26 : 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isFocused ? "rgba(201,168,76,0.16)" : "transparent",
                borderWidth: isFocused ? 1 : 0,
                borderColor: isFocused ? "rgba(201,168,76,0.30)" : "transparent",
              }}
            >
              <Icon size={isCenter ? 26 : 24} color={color} />
            </View>
            <View
              style={{
                marginTop: 6,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: isFocused ? colors.accent : "transparent",
                opacity: isFocused ? 1 : 0,
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function RootTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "transparent" },
        sceneContainerStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={SearchScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
