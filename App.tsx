
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import { RootStackParamList } from "./types";
import ProfileScreen from "./src/screens/ProfileScreen";
import DashboardTabs from "./src/components/DashboardTabs";
import ContentDetailScreen from "./src/screens/ContentDetailScreen";
import MyReviewsScreen from "./src/screens/MyNotificationScreen";
import MyUploadsScreen from "./src/screens/MyUploadsScreen";
import { StatusBar, View } from "react-native";
import ArtistListScreen from "src/screens/ArtistListScreen";
import AlbumListScreen from "src/screens/AlbumListScreen";
import RadioScreen from "src/screens/RadioScreen";
import ArtistDetailScreen from "src/screens/ArtistDetailScreen";
import AlbumDetailScreen from "src/screens/AlbumDetailScreen";
import MyNotificationScreen from "./src/screens/MyNotificationScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#ffffff"
      />

      <View style={{ flex: 1, backgroundColor: "#ffffff" }} >
        <NavigationContainer >
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              headerTitleAlign: "center",
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Dashboard" component={DashboardTabs} />
            <Stack.Screen name="MyUploads" component={MyUploadsScreen} />
            {/* <Stack.Screen name="MyPlaylists" component={MyPlaylistsScreen} />*/}
            <Stack.Screen name="MyNotification" component={MyNotificationScreen} />
            <Stack.Screen name="ContentDetail" component={ContentDetailScreen} />
            <Stack.Screen name="ArtistList" component={ArtistListScreen} />
            <Stack.Screen name="AlbumList" component={AlbumListScreen} />
            <Stack.Screen name="Radio" component={RadioScreen} />
            <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={{ title: "Detalhes do Artista" }} />
            <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} options={{ title: "Detalhes do Álbum" }} />


          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
}
