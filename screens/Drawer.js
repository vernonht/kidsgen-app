import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "../App";

import {
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import tailwind from 'tailwind-rn';

function DrawerContent(props) {
  const paperTheme = useTheme();
  const { state, dispatch } = React.useContext(AuthContext);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'SIGN_OUT' })
  }
  React.useEffect(() => {
    console.table(props)
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={tailwind('bg-blue-200 h-32 flex flex-row items-center px-2')}>
        <Icon
          raised
          name='user'
          type='font-awesome'
        />
        <Text style={tailwind('px-4 text-base font-bold')}>{state.user ? state.user['name'] : 'Guest'}</Text>
      </View>
      <Drawer.Section style={tailwind('text-xl')}>
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Home')}
        />
        {state.user ?
          <DrawerItem
            label="Manage Kids"
            onPress={() => props.navigation.navigate('Kids')}
          />
          : null
        }
        <DrawerItem
          label="Scan QR"
          onPress={() => props.navigation.navigate('Scan QR')}
        />
      </Drawer.Section>
      {state.user ?
        <DrawerItem
          labelStyle={tailwind('text-red-600 font-bold')}
          label="Logout"
          onPress={logout}
        />
        :
        <DrawerItem
          labelStyle={tailwind('text-blue-600 font-bold')}
          label="Login"
          onPress={() => props.navigation.navigate('Login')}
        />
      }
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
export default DrawerContent;
