import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import KidScreen from './kids/Kids'
import KidDetails from './kids/KidDetails'

const KidStack = createStackNavigator();

function KidStackScreen() {
  return (
    <KidStack.Navigator>
      <KidStack.Screen name="Kids" component={KidScreen} />
      <KidStack.Screen name="Kid Details" component={KidDetails} options={({ route }) => ({ title: route.params.title })} />
    </KidStack.Navigator>
  );
}
export default KidStackScreen;
