import React, { Component } from "react";
import { Animated, Text, View, StyleSheet, Button } from "react-native";

class Storage extends Component {
  state = {
    fadeAnimation: new Animated.Value(0)
  };

  fadeIn = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000
    }).start();
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      duration: 4000
    }).start();
  };

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              opacity: this.state.fadeAnimation
            }
          ]}
        >
          <Text style={styles.fadingText}>Hi!</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <Button title="Fade In" onPress={this.fadeIn} />
        </View>
        <View style={styles.buttonRow}>
          <Button title="Fade Out" onPress={this.fadeOut} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  fadingContainer: {
    paddingVertical: 5,
    paddingHorizontal: 25,
    backgroundColor: "lightseagreen"
  },
  fadingText: {
    fontSize: 28,
    textAlign: "center",
    margin: 10,
    color : "#fff"
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 16
  }
});

export default Storage;