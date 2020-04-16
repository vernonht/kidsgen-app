import axios from './AxiosConfig';
import AsyncStorage from '@react-native-community/async-storage';

export const getUserInfo = async () => {
  let token = await AsyncStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  let res = await axios.post('/user', {}, { headers })
  return res;
}