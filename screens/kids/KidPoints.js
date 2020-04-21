import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Card, Input, Button, Overlay } from 'react-native-elements';
import tailwind from 'tailwind-rn';
import axios from '../../services/AxiosConfig';
import { List } from 'react-native-paper';
import { AuthContext } from "../../App";
import { Formik } from 'formik'
import * as yup from 'yup'

function KidPoints({ route, navigation }) {
  const { kid } = route.params;
  const { state } = React.useContext(AuthContext);
  const [points, setPoints] = React.useState(kid.points);
  const [datas, setDatas] = React.useState([
    { time: '09:00', title: 'Event 1', description: 'Event 1 Description' },
    { time: '10:45', title: 'Event 2', description: 'Event 2 Description' },
    { time: '12:00', title: 'Event 3', description: 'Event 3 Description' },
    { time: '14:00', title: 'Event 4', description: 'Event 4 Description' },
    { time: '16:30', title: 'Event 5', description: 'Event 5 Description' }
  ]);
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

  const addPoints = async (values) => {
    setLoading(true)
    // set decimal point to 1
    values.points = parseFloat(values.points).toFixed(1)
    const headers = {
      'Authorization': `Bearer ${state.token}`
    };
    let res = await axios.post(`points`, {
      kid_id: kid.id,
      points: values.points,
      description: values.description,
    }, { headers })
    console.log(res, 'res');

    setLoading(false)
    navigation.goBack()
  }

  const editPoints = async (id, values) => {
    setLoading(true)
    // set decimal point to 1
    values.points = parseFloat(values.points).toFixed(1)
    const headers = {
      'Authorization': `Bearer ${state.token}`
    };
    await axios.put(`points/${id}`, {
      points: values.points,
      description: values.description,
    }, { headers })
    let point_history = await axios.get(`points/${kid.id}`, { headers })
    setPoints(point_history.data)
    setLoading(false)
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
    setModalVisible(false)
  }

  const showModal = (data) => {
    console.table(data)
    setModalData({
      id: data.id,
      kid_id: data.kid_id,
      points: parseFloat(data.points).toFixed(1),
      description: data.description,
    })
    setModalVisible(true)
  }

  return (
    <View>
      <Formik
        initialValues={{ points: 0, description: '' }}
        validationSchema={
          yup.object().shape({
            points: yup
              .number()
              .required('Point is required'),
          })}
        onSubmit={values => addPoints(values)}
      >
        {({ handleChange, values, handleSubmit, errors, isValid }) => (
          <Card>
            <View style={tailwind('flex mb-10')}>
              <View style={tailwind('flex mb-4')}>
                <Text style={tailwind('font-bold mb-2')}>Points</Text>
                <Input
                  containerStyle={tailwind('px-0')}
                  keyboardType='decimal-pad'
                  value={values.points.toString()}
                  onChangeText={handleChange('points')}
                />
                {errors.points &&
                  <Text style={{ fontSize: 14, color: 'red', textTransform: 'capitalize' }}>{errors.points}</Text>
                }
              </View>
              <View style={tailwind('flex mb-4')}>
                <Text style={tailwind('font-bold mb-2')}>Description</Text>
                <Input
                  containerStyle={tailwind('px-0')}
                  onChangeText={handleChange('description')}
                  value={values.description}
                />
                {errors.description &&
                  <Text style={{ fontSize: 14, color: 'red', textTransform: 'capitalize' }}>{errors.description}</Text>
                }
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
                disabled={!isValid}
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </Card>
        )}
      </Formik>

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
                  title={r.points.toFixed(1)}
                  description={r.description}
                  style={tailwind('bg-green-200 mr-10 mb-2 rounded')}
                />
                :
                <List.Item
                  title={r.points.toFixed(1)}
                  description={r.description}
                  style={tailwind('bg-red-200 mr-10 mb-2 rounded')}
                />
              }
            </TouchableOpacity>
          )}
        </List.Accordion>
      </List.Section>

      {/* Edit Points modal */}
      <Overlay
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        width="auto"
        height="auto"
      >
        <Formik
          initialValues={{ points: modalData.points, description: modalData.description }}
          validationSchema={
            yup.object().shape({
              points: yup
                .number()
                .required('Point is required'),
            })}
          onSubmit={values => editPoints(modalData.id, values)}
        >
          {({ handleChange, values, handleSubmit, errors, isValid }) => (
            <View style={tailwind('flex bg-white p-4 rounded')}>
              <View style={tailwind('flex mb-4')}>
                <Text style={tailwind('font-bold mb-2')}>Points</Text>
                <Input
                  containerStyle={tailwind('px-0')}
                  keyboardType='decimal-pad'
                  value={values.points.toString()}
                  onChangeText={handleChange('points')}
                />
                {errors.points &&
                  <Text style={{ fontSize: 14, color: 'red', textTransform: 'capitalize' }}>{errors.points}</Text>
                }
              </View>
              <View style={tailwind('flex mb-4')}>
                <Text style={tailwind('font-bold mb-2')}>Description</Text>
                <Input
                  containerStyle={tailwind('px-0')}
                  onChangeText={handleChange('description')}
                  value={values.description}
                />
                {errors.description &&
                  <Text style={{ fontSize: 14, color: 'red', textTransform: 'capitalize' }}>{errors.description}</Text>
                }
              </View>
              <View style={tailwind('flex flex-row justify-center')}>
                <Button
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
                  disabled={!isValid}
                  onPress={handleSubmit}
                  loading={loading}
                />
              </View>
            </View>
          )}
        </Formik>
      </Overlay>
    </View>
  );
}

export default KidPoints;
