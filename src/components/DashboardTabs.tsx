import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";
import MyUploadsScreen from "../screens/MyUploadsScreen";
import MyReviewsScreen from "../screens/MyNotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import RadioScreen from "src/screens/RadioScreen";

const Tab = createBottomTabNavigator();

export default function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: { 
          paddingVertical: 6, 
          height: 60 
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Uploads"
        component={MyUploadsScreen}
        options={{
          tabBarLabel: "Uploads",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="upload" size={18} color={color} />
          ),
        }}
      />

      
<Tab.Screen
  name="Radio"
  component={RadioScreen}
  options={{
    tabBarLabel: "Rádio",
    tabBarIcon: ({ color }) => (
      <Ionicons name="radio" size={22} color={color} />
    ),
    tabBarLabelStyle: { fontSize: 12 },
    tabBarIconStyle: {
      backgroundColor: "#a78bfa", // lilás
      padding: 8,
      borderRadius: 50,
    },
    tabBarActiveTintColor: "#fff",
    tabBarInactiveTintColor: "#eee",
  }}
/>
      
      <Tab.Screen
        name="Notification"
        component={MyReviewsScreen}
        options={{
          tabBarLabel: "Notificações",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />

      
    </Tab.Navigator>
  );
}
