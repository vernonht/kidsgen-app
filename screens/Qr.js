import * as React from 'react';
import { AppRegistry, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import tailwind from 'tailwind-rn';

function QrScreen({ navigation }) {
  const [camera, setCamera] = React.useState({});
  const onSuccess = e => {
    console.log(e);
    navigation.navigate('Kid Profile', {
      qr: e.data
    })
  };
  const takePicture = async function (camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    console.log(data.uri);
  };
  const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  );
  React.useEffect(() => {
    console.log(camera);

  }, [camera]);

  return (
    <QRCodeScanner
      onRead={onSuccess}
      reactivate={true}
      reactivateTimeout={10}
    />
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});

export default QrScreen;
