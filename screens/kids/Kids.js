import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
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
        containerStyle={tailwind('px-4')}
        lightTheme
        placeholder="Search..."
        onChangeText={searchKid}
        value={search}
      />
      <ScrollView refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }>
        {kids.map((r, key) =>
          <TouchableOpacity key={key} onPress={() => navigation.navigate('Kid Details', {
            title: r.name,
            kid: r
          })}>
            <KidCard navigation={navigation} kid={r}></KidCard>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View >
  );
}

export default KidsScreen;
