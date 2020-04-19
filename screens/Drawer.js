import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  const { dispatch } = React.useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section title="Navigation" style={tailwind('text-xl')}>
        <DrawerItemList {...props} />
      </Drawer.Section>
      <DrawerItem
        labelStyle={tailwind('text-red-600 font-bold')}
        label="Logout"
        onPress={() => { dispatch({ type: 'SIGN_OUT' }) }}
      />
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
