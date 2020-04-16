import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/Home'
import LoginScreen from './screens/Login'
import QrScreen from './screens/Qr'
import KidProfileScreen from './screens/KidProfile'
import KidStackScreen from './screens/KidStack'
import DrawerContent from './screens/Drawer'
import { getUserInfo } from './services/FetchUser'

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
};
const CombinedDarkTheme = { ...PaperDarkTheme, ...NavigationDarkTheme };

const Drawer = createDrawerNavigator();

function App() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme; // Use Light/Dark theme based on a state

  const toggleTheme = () => {
    // We will pass this function to Drawer and invoke it on theme switch press
    setIsDarkTheme(isDark => !isDark);
  }
  React.useEffect(() => {
    getUserInfo().then((res) => {
      setIsSignedIn(true)
      setIsLoading(false)
      console.table(res)
    })
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        {isSignedIn ? (
          <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <DrawerContent {...props} toggleTheme={toggleTheme} />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Kids" component={KidStackScreen} />
            <Drawer.Screen name="Qr" component={QrScreen} />
            <Drawer.Screen name="Kid Profile" component={KidProfileScreen} />
          </Drawer.Navigator>
        ) : (

            <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <DrawerContent {...props} toggleTheme={toggleTheme} />}>
              <Drawer.Screen name="Home" component={HomeScreen} />
              <Drawer.Screen name="Login" component={LoginScreen} />
              <Drawer.Screen name="Qr" component={QrScreen} />
              <Drawer.Screen name="Kid Profile" component={KidProfileScreen} />
            </Drawer.Navigator>
          )}
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
