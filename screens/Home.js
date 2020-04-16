import * as React from 'react';
import { Button, View, Text, Image } from 'react-native';
import tailwind from 'tailwind-rn';

function HomeScreen({ navigation }) {
  return (
    <View style={tailwind('flex h-full justify-center items-center')}>
      <Image
        style={tailwind('w-64 h-48')}
        source={require('../img/Kids-Gen-Logo.png')}
      />
      <View style={('mb-4')}>
        <Button
          title="Scan QR"
          onPress={() => navigation.navigate('Qr')}
        />
      </View>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}
export default HomeScreen;
