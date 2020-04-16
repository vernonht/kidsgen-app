import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Input, CheckBox, Icon, Button } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import tailwind from 'tailwind-rn';
import axios from '../../services/AxiosConfig';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
import { Snackbar } from 'react-native-paper';

function KidDetails({ route, navigation }) {
  const { kid } = route.params;
  const [data, setData] = React.useState({
    name: '',
    gender: '',
    dob: '',
    allergies: '',
  });
  const [token, setToken] = React.useState();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const getDob = () => {
    let arr = data.birthdate.split('-')
    console.log(arr.length, 'length');
    if (arr.length >= 3) {
      return new Date(arr[0], parseInt(arr[1]) - 1, arr[2])
    } else {
      return new Date()
    }
  };
  const setDob = (event, date) => {
    console.log(date);
    setData({ ...data, birthdate: date.toISOString().split('T')[0] })
  };
  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const launchCam = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log(source)
      }
    });
  };

  const updateKid = async () => {
    setLoading(true)
    let token = await AsyncStorage.getItem('token');
    setToken(token)
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Extract parent's id from collection
    let parent_ids = []
    for (let x of kid.kid_parents) {
      parent_ids.push(x.parent_id)
    }

    let res = await axios.put(`/kids/${kid.id}`, {
      name: data.name,
      gender: data.gender,
      birthdate: data.birthdate,
      allergies: data.allergies,
      parents: parent_ids
    }, { headers })
    console.log(res)
    _onToggleSnackBar()
    navigation.navigate('Kids')
  };

  const _onToggleSnackBar = () => setVisible(true);

  const _onDismissSnackBar = () => setVisible(false);

  React.useEffect(() => {
    setData(kid)
  }, []);

  return (
    <ScrollView>
      <View style={tailwind('flex justify-center px-4 overflow-scroll')}>
        <View style={tailwind('flex items-center my-4')}>
          <Avatar
            rounded
            size='xlarge'
            source={{
              uri: data.picture,
            }}
            showEditButton
            onEditPress={launchCam}
          />
        </View>
        <View style={tailwind('mb-4')}>
          <Text style={styles.label}>Name</Text>
          <Input
            value={data.name}
            onChangeText={name => setData({ ...data, name: name })}
          />
        </View>
        <View style={tailwind('mb-4')}>
          <Text style={styles.label}>Gender</Text>
          <Picker
            style={tailwind('border-b')}
            selectedValue={data.gender}
            style={{ height: 50, width: 150 }}
            onValueChange={(gender) => setData({ ...data, gender: gender })}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>
        <View style={tailwind('mb-4')}>
          <Text style={styles.label}>DOB</Text>
          <View style={tailwind('flex flex-row items-center px-3')}>
            <Text style={tailwind('text-lg pr-4')}>{data.birthdate}</Text>
            <Icon
              type='font-awesome'
              name='calendar'
              onPress={() => { setShowDatePicker(true) }}
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={getDob()}
              mode="date"
              display="default"
              onChange={setDob}
            />
          )}
        </View>
        <View style={tailwind('mb-4')}>
          <Text style={styles.label}>Allergies</Text>
          <Input
            value={data.allergies}
            onChangeText={allergies => setData({ ...data, allergies: allergies })}
          />
        </View>
        <View>
          <Button
            title="Update"
            onPress={updateKid}
            loading={loading}
          />
          <Snackbar
            visible={visible}
            onDismiss={_onDismissSnackBar}
          >
            Details updated
        </Snackbar>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 10
  }
});
export default KidDetails;
