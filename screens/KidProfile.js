import * as React from 'react';
import { View, Image } from 'react-native';
import { Card, Icon, Text, Button } from 'react-native-elements';
import axios from '../services/AxiosConfig';
import tailwind from 'tailwind-rn';

function KidProfileScreen({ route, navigation }) {
  const { qr } = route.params;
  const [kid, setKid] = React.useState({});
  const [parents, setParents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const attendance = (type) => {
    console.log(type, 'length');
  };
  const fetchData = async () => {
    try {
      // setLoading(true)
      setKid({})
      let res = await axios.get(`/access/${qr}`)
      setKid(res.data)
      let res2 = await axios.get(`/parents`)
      setParents(res2.data)
      setLoading(false)
    } catch (e) {
      console.warn(e, 123)
      setLoading(false)
    }
  }
  const findParent = (parent_id, type) => {
    let parent = parents.find(p => {
      return p.id == parent_id
    })
    return parent ? parent[type] : ''
  }

  // /access/${ this.detected }
  React.useEffect(() => {
    fetchData();
  }, [qr]);

  return (
    <View style={tailwind('flex h-full justify-center items-center')}>
      {/* Kid Profile */}
      {Object.keys(kid).length > 0 ?
        <Card style={tailwind('rounded')}>
          <View style={tailwind('flex flex-row items-center')}>
            <View style={tailwind('w-1/4')}>
              <Image
                style={tailwind('w-20 h-20 rounded-full')}
                source={{ uri: kid.picture }}
              />
            </View>
            <View style={tailwind('w-3/4 px-4')}>
              <Text>Name {kid.name}</Text>
              <Text>Gender: {kid.gender}</Text>
              <Text>Birthday: {kid.birthdate}</Text>
              <Text>Allergies: {kid.allergies}</Text>
              <Text style={tailwind('font-bold mt-4')}>Parents</Text>
              {kid.kid_parents.map((x, key2) =>
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
        : <Text>{qr ? qr : 'No data'}</Text>
      }
      <View style={tailwind('flex flex-row justify-between my-4')}>
        <Button
          containerStyle={tailwind('mr-2')}
          title="Rescan QR"
          onPress={() => navigation.navigate('Qr')}
        />
        <Button
          containerStyle={tailwind('mr-2')}
          title="Check in"
          onPress={attendance('check_out')}
          loading={loading}
        />
        <Button
          title="Check Out"
          onPress={attendance('check_out')}
          loading={loading}
        />
      </View>
    </View>
  );
}
export default KidProfileScreen;
