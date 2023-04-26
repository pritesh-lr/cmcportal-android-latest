import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "react-native-splash-screen";
import AppSlider from "./screen/AppSlider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const App = (props) => {
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [webViewVisible, setWebViewVisible] = React.useState(false);
  const [sliderView, setSliderView] = React.useState(undefined);

  React.useEffect(() => {
    async function fetchMyAPI() {
      SplashScreen.hide();
      try {
        const value = await AsyncStorage.getItem("@storage_Key");
        if (value !== null) {
          setSliderView(value);
        }
        if (value === "false") {
          setWebViewVisible(true);
        }
      } catch (e) {
        console.log(e.message);
      }
    }

    fetchMyAPI();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        {webViewVisible && (
          <NavigationContainer
            // ref={containerRef}
            initialState={initialNavigationState}
          >
            <Stack.Navigator>
              <Stack.Screen
                name="County Connect"
                component={BottomTabNavigator}
                options={{ headerTitleAlign: "center" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
        {!webViewVisible && sliderView !== "false" && (
          <AppSlider onSignInClick={(e) => setWebViewVisible(e)} />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
  flexContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    top: 0,
    position: "absolute",
    top: "50%",
    width: "100%",
  },
  tabBarContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
  },
  button: {
    color: "white",
    fontSize: 12,
  },
});

export default App;
