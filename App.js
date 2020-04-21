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
import AsyncStorage from '@react-native-community/async-storage';
import axios from './services/AxiosConfig';

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
};
const CombinedDarkTheme = { ...PaperDarkTheme, ...NavigationDarkTheme };

const Drawer = createDrawerNavigator();
export const AuthContext = React.createContext();

const initialState = {
  isLoading: true,
  isSignout: false,
  token: null,
  user: null
}
const reducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        token: action.token,
        user: action.user,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        token: action.token,
        user: action.user,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        token: null,
        user: null,
      };
  }
}


function App() {
  axios.interceptors.response.use((response) => {
    // do something with the response data

    return response;
  }, error => {
    if (error.response.status == 401) {
      dispatch({ type: 'SIGN_OUT' });
      console.log('token cleared')
    }
    console.log(error.response);
    // handle the response error
    return Promise.reject(error);
  });
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme; // Use Light/Dark theme based on a state

  const toggleTheme = () => {
    // We will pass this function to Drawer and invoke it on theme switch press
    setIsDarkTheme(isDark => !isDark);
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      let res;
      let success = false;

      try {
        token = await AsyncStorage.getItem('token');
        if (token) {
          // Load logged in user
          const headers = {
            'Authorization': `Bearer ${token}`
          };
          console.log(headers, 'what');
          res = await axios.post('/user', {}, { headers })
          console.log(res.data.success, 'data');
          success = true
        }
      } catch (e) {
        console.log(e.response)
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      if (success) {
        dispatch({ type: 'RESTORE_TOKEN', token: token, user: res.data.success });
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {state.token ? (
            <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <DrawerContent {...props} toggleTheme={toggleTheme} />}>
              <Drawer.Screen name="Home" component={HomeScreen} />
              <Drawer.Screen name="Kids" component={KidStackScreen} />
              <Drawer.Screen name="Scan QR" component={QrScreen} />
              <Drawer.Screen name="Kid Profile" component={KidProfileScreen} />
            </Drawer.Navigator>
          ) : (

              <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <DrawerContent {...props} toggleTheme={toggleTheme} />}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={LoginScreen} />
                <Drawer.Screen name="Scan QR" component={QrScreen} />
                <Drawer.Screen name="Kid Profile" component={KidProfileScreen} />
              </Drawer.Navigator>
            )}
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}

export default App;
