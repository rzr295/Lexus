import React from 'react';
import ReactNative from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { StyleSheet, Animated, Text, TouchableOpacity } = ReactNative

const chevron_left_icon = (<FontAwesome5 name={'chevron-left'} size={30} />);

export default class Footer extends React.Component {
    render() {
        return (
            <Animated.View style={[styles.footer, {transform: [{translateY: this.state.bounceValue}]}]}>
                <TouchableOpacity
                  disabled={!this.props.canGoBack}
                  onPress={this.props.goBack}
                  style={styles.footerTextGroup}
                >
                <Text style={this.props.canGoBack ? styles.footerText : styles.footerTextDisabled}>{chevron_left_icon}</Text>
                <Text style={this.props.canGoBack ? styles.footerText : styles.footerTextDisabled}>Back</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    constructor(props) {
      super(props);
      this.state = {
        bounceValue: new Animated.Value(50)
      };
    }
    
    _toggleSubview(isHidden = false) { 
      var toValue = isHidden ? 0 : 50;
  
      //This will animate the transalteY of the subview between 0 & 100 depending on its current state
      //100 comes from the style below, which is the height of the subview.
      //if (this.props.canGoBack)
        Animated.spring(
          this.state.bounceValue,
          {
            toValue,
            velocity: 3,
            tension: 2,
            friction: 8,
          }
        ).start();
    }
}

const styles = StyleSheet.create({
    footer: {
      height: 50,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'black',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0
    },
    footerText: {
      color: 'white',
      fontSize: 15,
      paddingHorizontal: 2,
    },
    footerTextDisabled: {
      color: 'gray',
      fontSize: 15,
      paddingHorizontal: 2,
    },
    footerTextGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 14
    }
  });