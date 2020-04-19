import * as React from 'react';
import { View, Image, Linking } from 'react-native';
import { Card, Icon, Text, Button, Input } from 'react-native-elements';
import tailwind from 'tailwind-rn';
import { AuthContext } from "../App";

function KidCard(props) {
  const { kid } = props;
  const { state } = React.useContext(AuthContext);
  const [data, setData] = React.useState({
    points: 0,
    description: ''
  });

  const sumPoints = (points) => {
    let total = 0
    for (let x of points) {
      total += x.points
    }
    return total.toFixed(1);
  }

  return (
    <View style={tailwind('flex justify-center items-center')}>
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
              <View style={tailwind('flex flex-row items-center justify-between mb-2')}>
                <Text>Points: {sumPoints(kid.points)}</Text>
                <View style={tailwind('flex flex-row')}>
                  <Button
                    buttonStyle={tailwind('px-4')}
                    type='outline'
                    raised
                    title="Points"
                    icon={{
                      name: 'smile-o',
                      type: 'font-awesome',
                      color: '#1f89dc'
                    }}
                    onPress={() => props.navigation.navigate('Kid Points', {
                      title: kid.name,
                      kid: kid
                    })}
                  />
                </View>
              </View>
              <Text style={tailwind('font-bold mt-4')}>Parents</Text>
              {kid.kid_parents.map((x, key2) =>
                <View key={key2} style={tailwind('flex flex-row items-center justify-between mb-2')}>
                  <Text>{x.name}</Text>
                  <View style={tailwind('flex flex-row')}>
                    <Icon
                      containerStyle={tailwind('w-8 h-8 flex justify-center border border-gray-500 rounded-full mx-1')}
                      color='#2089dc'
                      size={16}
                      name='phone'
                      type='font-awesome'
                      onPress={() => Linking.openURL(`tel:${x.contact}`)} />
                    <Icon
                      containerStyle={tailwind('w-8 h-8 flex justify-center border border-gray-500 rounded-full mx-1')}
                      color='#2089dc'
                      size={16}
                      name='envelope'
                      type='font-awesome'
                      onPress={() => Linking.openURL(`mailto:${x.email}`)} />
                  </View>
                </View>
              )}
            </View>
          </View>
        </Card>
        : <Text>No data</Text>
      }
    </View>
  );
}
export default KidCard;
