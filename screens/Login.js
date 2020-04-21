import * as React from 'react';
import { View, Text } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import tailwind from 'tailwind-rn';
import axios from '../services/AxiosConfig';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "../App";
import { Formik } from 'formik'
import * as yup from 'yup'

function LoginScreen({ navigation }) {
  const { state, dispatch } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const login = async (values) => {
    try {
      setLoading(true)
      let res = await axios.post("/login", {
        email: values.email,
        password: values.password
      })
      console.log(res.data)
      setLoading(false)
      await AsyncStorage.setItem('token', res.data.success.token);
      dispatch({ type: 'SIGN_IN', token: res.data.success.token, user: res.data.user });
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
    <Formik
      initialValues={{ email: 'abc@yahoo.com', password: 'harvestgen' }}
      validationSchema={
        yup.object().shape({
          email: yup
            .string('Please enter your email')
            .email('Email is invalid')
            .required('Email is required'),
          password: yup
            .string('Password is invalid')
            .required('Password is required'),
        })}
      onSubmit={values => login(values)}
    >
      {({ handleChange, values, handleSubmit, errors, isValid }) => (
        <View style={tailwind('flex h-full justify-center px-4')}>
          <Text style={tailwind('text-3xl font-bold mb-4')}>Login</Text>
          <Input
            label='Email'
            value={values.email}
            onChangeText={handleChange('email')}
            autoCompleteType={'email'}
            autoCapitalize='none'
            containerStyle={tailwind('px-0 mb-4')}
            leftIcon={
              <Icon
                name='email'
                type='material'
                size={24}
                color='black'
              />
            }
          />
          {errors.email &&
            <Text style={{ fontSize: 14, color: 'red', textTransform: 'capitalize' }}>{errors.email}</Text>
          }
          <Input
            label='Password'
            value={values.password}
            onChangeText={handleChange('password')}
            secureTextEntry={true}
            containerStyle={tailwind('px-0 mb-4')}
            leftIcon={
              <Icon
                name='lock'
                type='material'
                size={24}
                color='black'
              />
            }
          />
          {errors.password &&
            <Text style={{ fontSize: 14, color: 'red', textTransform: 'capitalize' }}>{errors.password}</Text>
          }
          <View style={tailwind('my-4')}>
            <Button
              title="Login"
              onPress={handleSubmit}
              disabled={!isValid}
              loading={loading}
            />
          </View>
        </View>
      )}
    </Formik>
  );
}
export default LoginScreen;
