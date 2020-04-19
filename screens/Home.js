import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import tailwind from 'tailwind-rn';
import { AuthContext } from "../App";

function HomeScreen({ navigation }) {
  const { state } = React.useContext(AuthContext);
  return (
    <View style={tailwind('flex h-full justify-center items-center')}>
      <Image
        style={tailwind('w-64 h-48')}
        source={require('../img/Kids-Gen-Logo.png')}
      />
      <View>
        <Button
          containerStyle={tailwind('pb-4')}
          buttonStyle={tailwind('px-8')}
          title="Scan QR"
          onPress={() => navigation.navigate('Scan QR')}
        />
        {state.token ?
          <Button
            containerStyle={tailwind('pb-4')}
            buttonStyle={tailwind('px-8')}
            title="Manage Kids"
            onPress={() => navigation.navigate('Kids')}
          />
          :
          <Button
            containerStyle={tailwind('pb-4')}
            buttonStyle={tailwind('px-8')}
            title="Login"
            onPress={() => navigation.navigate('Login')}
          />
        }
      </View>
    </View>
  );
}
export default HomeScreen;
