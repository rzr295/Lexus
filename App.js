import React, {Component} from 'react';
import ReactNative from 'react-native';
import Footer from './components/Footer';

const {
  StyleSheet,
  View,
  WebView,  
  Linking, 
  Alert,
  Dimensions
} = ReactNative;

export default class App extends Component {
  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout.bind(this)}>
        <WebView
          useWebKit={true} 
          source={{uri: './widget/index.html'}} 
          originWhitelist={['*']}          
          ref={r => this.webview = r}
          javaScriptEnabled={true}
          injectedJavaScript={`(${onLoadScript})()`}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          onMessage={this.onMessage.bind(this)}         
          />
        <Footer ref={this.footer} goBack={this.onBack} canGoBack={this.state.canGoBack}/>
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = { 
      canGoBack: false
    };
    this.footer = React.createRef();
  }

  onNavigationStateChange(webViewState) {
    this.setState({
      canGoBack: webViewState.canGoBack,
      url: webViewState.url
    });
  }

  onBack = () => {
    this.webview.goBack();
  }

  onMessage(e) {
    // retrieve event data
    var data = e.nativeEvent.data;

    // maybe parse stringified JSON
    try {
      data = JSON.parse(data)
    } catch ( e ) {  }
    // check if this message concerns us
    if ('object' == typeof data ) {
      if (data.external_url_open ) {
        // proceed with URL open request
        if (data.external_url_open === 'javascript:;') return;
        return Alert.alert(
          'External URL',
          'Do you want to open this URL in your browser?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: () => Linking.openURL( data.external_url_open )},
          ],
          { cancelable: false }
        );
      } else if (data.scrolling) {
        var isHidden = false;
        if (data.scrolling === 'down') {
          isHidden = true;
        } else {
          isHidden = false;
        }
        this.footer.current._toggleSubview(isHidden);
      } else if (data.document_height) {
        if (data.document_height < this.state.height) {
        }
      }
    }
  }

  onLayout(e) {
    const { height } = e.nativeEvent.layout;
    this.setState({height});
  }
}

const onLoadScript = function() {
  // patch postMessage
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) { 
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() { 
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };

  window.postMessage = patchedPostMessage;

  // // send canGoBack
  // var loc = window.location.origin + window.location.pathname
  // var canGoBack = !(loc === document.querySelector('.brand-logo').getAttribute('href'));
  // window.postMessage(JSON.stringify({
  //   canGoBack: canGoBack
  // }));

  // send document height
  var body = document.body, html = document.documentElement;
  var height = Math.min(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  window.postMessage(JSON.stringify({
    document_height: height
  }));

  // // send external link to react side
  // var attachEvent = function(elem, event, callback)
  // {
  //     event = event.replace(/^on/g, '');
     
  //     if ( 'addEventListener' in window ) {
  //         elem.addEventListener(event, callback, false);            
  //     } else if ( 'attachEvent' in window ) {
  //         elem.attachEvent('on'+event, callback);            
  //     } else {
  //         var registered = elem['on' + event];
  //         elem['on' + event] = registered ? function(e) {
  //             registered(e);
  //             callback(e);
  //         } : callback;
  //     }
      
  //     return elem;
  // }
  // var all_links = document.querySelectorAll('a[href]');
  // if ( all_links ) {
  //     for ( var i in all_links ) {
  //         if ( all_links.hasOwnProperty(i) ) {
  //             attachEvent(all_links[i], 'onclick', function(e){
  //                 if ( !new RegExp( '^https?:\/\/' + location.host, 'gi' ).test(this.href) || this.getAttribute('target') === '_blank') {
  //                     // handle external URL
  //                     console.log(this.href);
  //                     e.preventDefault();
  //                     window.postMessage(JSON.stringify({
  //                         external_url_open: this.href
  //                     }));
  //                 }
  //             });
  //         }
  //     }
  // }

    // Scroll
    var lastScrollTop = 0;

    window.onscroll = function() {
      var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop){
          window.postMessage(JSON.stringify({
            scrolling: 'down'
          }))
        } else {
          window.postMessage(JSON.stringify({
            scrolling: 'up'
          }))
        }
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
