import * as React from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { Card, Icon } from 'react-native-elements'
import tailwind from 'tailwind-rn';
import axios from '../../services/AxiosConfig';
import AsyncStorage from '@react-native-community/async-storage';

function KidsScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [kids, setKids] = React.useState([]);
  const [parents, setParents] = React.useState([]);
  const [token, setToken] = React.useState();
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      // setLoading(true)
      let token = await AsyncStorage.getItem('token');
      setToken(token)
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      let res = await axios.get('/kids', { headers })
      setKids(res.data)
      let res2 = await axios.get('/parents', { headers })
      setParents(res2.data)
      setLoading(false)
      console.log('loaded')
    } catch (e) {
      console.warn(e, 123)
      switch (e.response.status) {
        case 401:
          alert('Unauthorized');
          break;
        default:

      }
      setLoading(false)
    }
  }

  const findParent = (parent_id, type) => {
    let parent = parents.find(p => {
      return p.id == parent_id
    })
    return parent ? parent[type] : ''
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={tailwind('flex h-full justify-center')}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }>
        <ActivityIndicator animating={loading} />
        {kids.map((r, key) =>
          <TouchableOpacity key={key} onPress={() => navigation.navigate('Kid Details', {
            title: r.name,
            kid: r
          })}>
            <Card style={tailwind('rounded')}>
              <View style={tailwind('flex flex-row items-center')}>
                <View style={tailwind('w-1/4')}>
                  <Image
                    style={tailwind('w-20 h-20 rounded-full')}
                    source={{ uri: r.picture }}
                  />
                </View>
                <View style={tailwind('w-3/4 px-4')}>
                  <Text>Name {r.name}</Text>
                  <Text>Gender: {r.gender}</Text>
                  <Text>Birthday: {r.birthdate}</Text>
                  <Text>Allergies: {r.allergies}</Text>
                  <Text style={tailwind('font-bold mt-4')}>Parents</Text>
                  {r.kid_parents.map((x, key2) =>
                    <View key={key2} style={tailwind('flex flex-row items-center justify-between mb-2')}>
                      <Text>{findParent(x.parent_id, 'name')}</Text>
                      <View style={tailwind('flex flex-row')}>
                        <Icon
                          containerStyle={tailwind('w-8 h-8 flex justify-center border border-gray-500 rounded-full mx-1')}
                          color='#2089dc'
                          size={16}
                          name='phone'
                          type='font-awesome'
                          onPress={() => Linking.openURL(`tel:${findParent(x.parent_id, 'contact')}`)} />
                        <Icon
                          containerStyle={tailwind('w-8 h-8 flex justify-center border border-gray-500 rounded-full mx-1')}
                          color='#2089dc'
                          size={16}
                          name='envelope'
                          type='font-awesome'
                          onPress={() => Linking.openURL(`tel:${findParent(x.parent_id, 'email')}`)} />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View >
  );
}

export default KidsScreen;
