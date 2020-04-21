import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import tailwind from 'tailwind-rn';
import axios from '../../services/AxiosConfig';
import KidCard from '../../components/KidCard'
import { AuthContext } from "../../App";

function KidsScreen({ navigation }) {
  const { state } = React.useContext(AuthContext);
  const [search, setSearch] = React.useState('');
  const [kids, setKids] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      // setLoading(true)
      const headers = {
        'Authorization': `Bearer ${state.token}`
      };
      let res = await axios.get('/kids', { headers })
      setKids(res.data)
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

  const searchKid = async (input) => {
    try {
      setSearch(input)
      const headers = {
        'Authorization': `Bearer ${state.token}`
      };
      let res = await axios.get(`/search/${input}`, { headers })
      setKids(res.data)
      console.log('loaded')
    } catch (e) {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={tailwind('flex h-full justify-center')}>
      <SearchBar
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        containerStyle={tailwind('px-4')}
        lightTheme
        placeholder="Search..."
        onChangeText={searchKid}
        value={search}
      />
      <ScrollView style={tailwind('mb-4')} refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }>
        {kids.map((r, key) =>
          <TouchableOpacity key={key} onPress={() => navigation.navigate('Kid Details', {
            title: r.name,
            kid: r,
            formType: 'edit'
          })}>
            <KidCard navigation={navigation} kid={r}></KidCard>
          </TouchableOpacity>
        )}
      </ScrollView>
      <ActionButton backdrop buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="New Kid" onPress={() => navigation.navigate('Kid Details', {
          title: 'New Kid',
          kid: null,
          formType: 'new'
        })}>
          <Icon type='entypo' name="plus" color="#fff" />
        </ActionButton.Item>
      </ActionButton>
    </View >
  );
}

export default KidsScreen;
