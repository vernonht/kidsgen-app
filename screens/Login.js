import * as React from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';
import tailwind from 'tailwind-rn';
import axios from '../services/AxiosConfig';
import AsyncStorage from '@react-native-community/async-storage';

function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('admin@harvestgen.org');
  const [password, setPassword] = React.useState('harvestgen');
  const [loading, setLoading] = React.useState(false);
  const login = async () => {
    try {
      alert(password)
      setLoading(true)
      let res = await axios.post("/login", {
        email: email,
        password: password
      })
      console.log(res.data.success.token)
      await AsyncStorage.setItem('token', res.data.success.token);
      setLoading(false)
    } catch (e) {
      switch (e.response.status) {
        case 401:
          alert('Credentials mismatch');
          break;
        default:

      }
      console.warn(e.response);
      setLoading(false)
    }
  };
  return (
    <View style={tailwind('flex h-full justify-center px-4')}>
      <Text style={tailwind('text-3xl font-bold mb-4')}>Login</Text>
      <TextInput
        style={{ width: '100%' }}
        label='Email'
        value={email}
        onChangeText={text => setEmail(text)}
        autoCompleteType={'email'}
        autoCapitalize='none'
        style={tailwind('mb-4')}
      />
      <TextInput
        label='Password'
        value={password}
        onChangeText={event => setPassword(event)}
        secureTextEntry={true}
        style={tailwind('mb-4')}
      />
      <Button
        title="Login"
        mode={'contained'}
        onPress={login}
        loading={loading}
      >Login</Button>
    </View>
  );
}
export default LoginScreen;
