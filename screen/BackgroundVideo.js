import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Linking
} from 'react-native';
import styled from 'styled-components/native';
import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');
import Storage from './Storage';
const dimensions = Dimensions.get('screen');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {getInset} from 'react-native-safe-area-view';
// const bottomPadding = getInset('bottom', false); 
// const topPadding = getInset('top', false); 
var isIphoneX = DeviceInfo.hasNotch();

export default class BackgroundVideo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posY: new Animated.Value(0),
      posX: new Animated.Value(-100),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.posY, {
      // toValue:Math.round(dimensions.height/2-150),
      toValue:Math.round(dimensions.height/2-150) - (isIphoneX ? 40: 0),
      duration: 500,
      useNativeDriver:false
    }).start();
    Animated.timing(this.state.posX, {
      // toValue:((dimensions.height/2)/3) - (isIphoneX ? 80 : 0),
      toValue:80,
      duration: 500,
      useNativeDriver:false,
    }).start();
  }

  signInClicked = async() => {
    this.props.takevalue(true)
    try {
    await AsyncStorage.setItem('@storage_Key', "false")
    } catch (e) {
      console.log("e ----->", e);
    }
  }

  renderRectangle = () => {
    const animatedStyle = {top: this.state.posY};
    return (
      <View>
        <Animated.View style={[animatedStyle]}>
          <Logo
            style={{
              height: 80,
              width: 80,
              display: 'flex',
              alignItems: 'center',
              //marginBottom: 70,
            }}
            source={require('./../assets/images/cmc.png')}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    );
  };
  renderButton = () => {
    const animatedStyle = {bottom: this.state.posX,
      alignItems: 'center'};
    return (
      <View style={{marginLeft: 0}}>
        <Animated.View style={[animatedStyle]}>
          <ButtonWrapper>
            <Fragment>
              <TouchableOpacity onPress={() => this.signInClicked()}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </View>
              </TouchableOpacity>

              <View style={{marginTop: 10}}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Trouble logging in?
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white'}}>Contact </Text>
                  
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${"portalsupport@countymaterials.com"}`)}>
                    <Text
                      style={{color: 'white', textDecorationLine: 'underline'}}>
                      Portal Support
                    </Text>
                  </TouchableOpacity>

                  
                </View>
              </View>

              {/* <Button transparent title="Login" /> */}
            </Fragment>
          </ButtonWrapper>
        </Animated.View>
      </View>
    );
  };
  render() {
    return (
      <View>
        <View>
          <Video
            source={require('./../assets/images/County_Materials.mp4')}
            //style={{ width:'100%', height:"100%"}}
            style={styles.backgroundVideo}
            muted={true}
            repeat={true}
            resizeMode="stretch"
            rate={0.5}
            ignoreSilentSwitch={'obey'}
          />

          <Wrapper>
            <View style={{alignItems: 'center'}}>{this.renderRectangle()}</View>
            <View style={{alignItems: 'center'}}>{this.renderButton()}</View>
          </Wrapper>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    //flex:1,
    //position: "absolute",
    // top: 0,
    // left: 0,
    // //alignItems: "stretch",
    // bottom: 0,
    // right: 0,

    height: height,
    width: width,
  },
  button: {
    //marginBottom: 30,
    width: dimensions.width - 120,
    alignItems: 'center',
    backgroundColor: '#f70028',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  container: {
    flex: 1,
  },
  rectangle: {
    backgroundColor: '#2c3e50',
    width: 50,
    height: 50,
    borderRadius: 50,
    position: 'absolute',
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 20,
  },
  buttonStyle: {
    padding: 5,
    height: 30,
    backgroundColor: 'limegreen',
  },
});

// styled-component
  // padding: 60px;

export const Wrapper = styled.View`
  paddingBottom: 60px;
  paddingLeft: 60px;
  paddingRight: 60px;
  align-items: center;
  flex-direction: column;
  position: absolute;
`;
export const Logo = styled.Image`
  width: 30px;
  height: 50px;
`;

export const ButtonWrapper = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 550px;
`;

const StyledButton = styled.TouchableHighlight`
 width:250px;
 background-color:${(props) => (props.transparent ? 'transparent' : '#f3f8ff')};
 padding:10px;
 border:${(props) => (props.transparent ? '1px solid #f3f8ff ' : 0)}
 justify-content:center;
 margin-bottom:20px;
 border-radius:24px
`;

const StyledTitle = styled.Text`
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  letter-spacing: 3;
  color: ${(props) => (props.transparent ? '#f3f8ff ' : '#666')};
`;
export const Button = ({onPress, color, ...props}) => {
  return (
    <StyledButton {...props}>
      <StyledTitle {...props}>{props.title}</StyledTitle>
    </StyledButton>
  );
};