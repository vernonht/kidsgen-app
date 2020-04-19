import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Card, Input, Button } from 'react-native-elements';
import tailwind from 'tailwind-rn';
import axios from '../../services/AxiosConfig';
import { Snackbar, List, Colors, IconButton } from 'react-native-paper';
import Modal from 'react-native-modal';
import NumericInput from 'react-native-numeric-input'
import { AuthContext } from "../../App";

function KidPoints({ route, navigation }) {
  const { kid } = route.params;
  const { state } = React.useContext(AuthContext);
  const [points, setPoints] = React.useState(kid.points);
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalData, setModalData] = React.useState({
    points: 0,
    description: '',
  });

  const [data, setData] = React.useState({
    points: 0,
    description: ''
  });

  const addPoints = async () => {
    setLoading(true)
    const headers = {
      'Authorization': `Bearer ${state.token}`
    };
    let res = await axios.post(`points`, {
      kid_id: kid.id,
      points: data.points,
      description: data.description,
    }, { headers })
    console.log(res, 'res');

    setLoading(false)
    _onToggleSnackBar()
    navigation.goBack()
  }

  const editPoints = async (id) => {
    setLoading(true)
    const headers = {
      'Authorization': `Bearer ${state.token}`
    };
    await axios.put(`points/${id}`, {
      points: modalData.points,
      description: modalData.description,
    }, { headers })
    let point_history = await axios.get(`points/${kid.id}`, { headers })
    setPoints(point_history.data)
    setLoading(false)
    _onToggleSnackBar()
    setModalVisible(false)
  }

  const deletePoints = async (id) => {
    setLoading(true)
    const headers = {
      'Authorization': `Bearer ${state.token}`
    };
    await axios.delete(`points/${id}`, { headers })
    let point_history = await axios.get(`points/${kid.id}`, { headers })
    setPoints(point_history.data)
    setLoading(false)
    _onToggleSnackBar()
    setModalVisible(false)
  }

  const showModal = (data) => {
    setModalData(data)
    setModalVisible(true)
  }

  const _onToggleSnackBar = () => setVisible(true);
  const _onDismissSnackBar = () => setVisible(false);

  return (
    <View>
      <Card>
        <View style={tailwind('flex mb-10')}>
          <View style={tailwind('flex mb-4')}>
            <Text style={tailwind('font-bold mb-2')}>Points</Text>
            <NumericInput
              value={data.points}
              step={0.5}
              rounded
              valueType='real'
              onChange={points => setData({ ...data, points: points })} />
          </View>
          <View style={tailwind('flex mb-4')}>
            <Text style={tailwind('font-bold mb-2')}>Description</Text>
            <Input
              onChangeText={description => setData({ ...data, description: description })}
              value={data.description}
            />
          </View>
        </View>
        <View style={tailwind('flex flex-row justify-center')}>
          <Button
            containerStyle={tailwind('mr-2')}
            raised
            title="Close"
            onPress={() => {
              navigation.goBack()
            }}
            loading={loading}
          />
          <Button
            raised
            title="Add points"
            onPress={addPoints}
            loading={loading}
          />
          <Snackbar
            visible={visible}
            onDismiss={_onDismissSnackBar}
          >
            Points updated
        </Snackbar>
        </View>
      </Card>
      <List.Section>
        <List.Accordion
          title="Points History"
          left={props => <List.Icon {...props} icon="history" />}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          {points.map((r, key) =>
            <TouchableOpacity key={key} onPress={() => showModal(r)}>
              {r.points > 0 ?
                <List.Item
                  title={r.points}
                  description={r.description}
                  left={props => <List.Icon {...props} color={Colors.green500} icon="thumb-up" />}
                />
                :
                <List.Item
                  title={r.points}
                  description={r.description}
                  left={props => <List.Icon {...props} color={Colors.red500} icon="thumb-down" />}
                />
              }
            </TouchableOpacity>
          )}
        </List.Accordion>
      </List.Section>

      {/* Edit Points modal */}
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={tailwind('flex bg-white p-4 rounded')}>
          <View style={tailwind('flex mb-4')}>
            <Text style={tailwind('font-bold mb-2')}>Points</Text>
            <NumericInput
              value={modalData.points}
              step={0.5}
              rounded
              valueType='real'
              onChange={points => setModalData({ ...modalData, points: points })} />
          </View>
          <View style={tailwind('flex mb-4')}>
            <Text style={tailwind('font-bold mb-2')}>Description</Text>
            <Input
              onChangeText={description => setModalData({ ...modalData, description: description })}
              value={modalData.description}
            />
          </View>
          <View style={tailwind('flex flex-row justify-center')}>
            <Button
              buttonStyle={tailwind('text-red-500')}
              type="clear"
              title="Delete"
              onPress={() => deletePoints(modalData.id)}
              loading={loading}
            />
            <Button
              containerStyle={tailwind('mr-2')}
              raised
              title="Close"
              onPress={() => setModalVisible(false)}
            />
            <Button
              buttonStyle={tailwind('px-8')}
              raised
              title="Edit"
              onPress={() => editPoints(modalData.id)}
              loading={loading}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
export default KidPoints;
