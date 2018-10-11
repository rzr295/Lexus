import React, {Component} from 'react';
import ReactNative from 'react-native';

const {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  WebView
} = ReactNative;

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <WebView 
          useWebKit={true} 
          source={{uri: './widget/index.html'}} 
          originWhitelist={['*']}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
