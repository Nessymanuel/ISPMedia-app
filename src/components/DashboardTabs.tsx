import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";
import MyUploadsScreen from "../screens/MyUploadsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import RadioScreen from "src/screens/RadioScreen";
import LibraryScreen from "src/screens/LibraryScreen";// Novo componente para biblioteca (crie se não existir)
import { View } from "react-native";


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
          height: 60,
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
          tabBarIcon: ({ focused }) => (
            <View style={{backgroundColor: "#a78bfa", padding: 10,borderRadius: 30,}}>
              <Ionicons name="radio" size={22} color="#fff" />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            color: "#a78bfa",
          },
        }}
      />

      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: "Biblioteca",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="library-books" size={22} color={color} />
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