import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  Animated,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import img1 from './../assets/images/main.png';
import img2 from './../assets/images/img2.png';
import BackgroundVideo from './BackgroundVideo';
const dimensions = Dimensions.get('window');
const {height, width} = Dimensions.get('window');

class AppSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      myindex: 0,
      fadeAnimation: new Animated.Value(0),
      posY: new Animated.Value(0),
      posX: new Animated.Value(-100),
      carouselItems: [
        {
          imgUrl: img1,
          text: `Welcome to the`,
          text2: `County Connect Portal`,
          height: 100,
          width: 240,
          id: 1,
        },
        {
          imgUrl: img2,
          text: 'Everything in One Place',
          text2:
            'Access company news and resources, employment benefits, and human resources services faster than ever before.',
          width: Math.round(dimensions.height / 3.2),
          height: Math.round(dimensions.height / 1.6),
          id: 2,
        },
        {},
      ],
    };
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 5,
      duration: 4000,
      useNativeDriver:true,
    }).start();
  }

  fadeIn = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  };

  renderItem = ({item, index}) => {
    const animatedStyle = {top: this.state.posY};
    const animatedStyle2 = {top: this.state.posX};

    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          backgroundColor: '#ffffff',
        }}>
        {this.state.activeIndex === 2 ? (
          <>
            <View>
              <BackgroundVideo
                takevalue={(e) =>
                  this.props.onSignInClick(e)
                }></BackgroundVideo>
            </View>
          </>
        ) : index === 1 ? (
          <>
            <Animated.View style={[animatedStyle]}>
              <View
                style={{
                  marginTop: index === 0 ? 300 : index === 1 ? 90 : null,
                  alignItems: 'center',
                }}>
                <Image
                  source={item.imgUrl}
                  style={{
                    height: item.height,
                    width: item.width,
                    marginBottom: index === 1 ? 0 : 50,
                  }}
                />
              </View>
            </Animated.View>

            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 27,
                }}>
                {item.text}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: index === 1 ? null : 'bold',
                  fontSize: 16,
                  marginTop: index === 1 ? 15 : null,
                  color: index === 1 && 'gray',
                  width: 355,
                  margin: 0,
                }}>
                {item.text2}
              </Text>
            </View>
          </>
        ) : index === 0 ? (
          <>
            <Animated.View
              style={[
                {
                  opacity: this.state.fadeAnimation,
                },
              ]}>
              <View style={{marginTop: '80%'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: index === 1 ? 'bold' : null,
                    fontSize: 20,
                  }}>
                  {item.text}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: index === 1 ? null : 'bold',
                    fontSize: index === 1 ? 15 : 25,
                  }}>
                  {item.text2}
                </Text>
              </View>
              <View
                style={{
                  marginTop: index === 0 ? 30 : index === 1 ? 90 : null,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('./../assets/images/left.gif')}
                  style={{width: 100, height: 100}}
                />
              </View>
            </Animated.View>
          </>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View style={{height: '100%', backgroundColor: '#ffffff'}}>
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          firstItem={this.state.activeIndex}
          sliderWidth={width}
          itemWidth={width}
          //style={{backgroundColor:'green'}}
          data={this.state.carouselItems}
          renderItem={this.renderItem}
          containerCustomStyle={{overflow: 'visible'}}
          contentContainerCustomStyle={{overflow: 'visible'}}
          onSnapToItem={(index) => this.setState({activeIndex: index})}
          scrollEnabled={this.state.activeIndex === 2 ? false : true}
          // onSnapToItem={() => {
          //   this.state.carouselItems.slice(1);
          //   this._carousel.snapToItem(this.state.activeIndex, false, false);
          // }}
        />

        {this.state.activeIndex !== 2 && (
          <Pagination
            dotsLength={3}
            activeDotIndex={this.state.activeIndex}
            containerStyle={{
              bottom: -6,
              height: 1,
              width: 4,
              alignSelf: 'center',
              //backgroundColor:'blue'
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: '#f70028',
              bottom: 0,
            }}
            inactiveDotStyle={{
              backgroundColor: 'gray',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logoStyle: {
    width: width,
    height: width,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    paddingVertical: 5,
    paddingHorizontal: 25,
    backgroundColor: 'lightseagreen',
  },
  fadingText: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 16,
  },
});

export default AppSlider;
