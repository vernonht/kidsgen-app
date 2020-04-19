import * as React from 'react';
import { View, Image, Linking } from 'react-native';
import { Card, Icon, Text, Button } from 'react-native-elements';
import axios from '../services/AxiosConfig';
import tailwind from 'tailwind-rn';
import KidCard from '../components/KidCard'

function KidProfileScreen({ route, navigation }) {
  const { qr } = route.params;
  const [kid, setKid] = React.useState({});
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
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  // /access/${ this.detected }
  React.useEffect(() => {
    if (route.params.qr) {
      fetchData();
    } else {
      navigation.navigate('Scan QR')
    }
  }, [qr]);

  return (
    <View style={tailwind('flex h-full justify-center items-center')}>
      <KidCard kid={kid}></KidCard>
      <View style={tailwind('flex flex-row justify-between my-4')}>
        <Button
          containerStyle={tailwind('mr-2')}
          title="Rescan QR"
          onPress={() => navigation.navigate('Scan QR')}
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
