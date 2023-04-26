import React, { useState, useEffect, useRef, Fragment } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import styles from "./DashBoardStyle";

import RNFetchBlob from "rn-fetch-blob";
var RNFS = require("react-native-fs");
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";
import CookieManager from "react-native-cookies";
import { unzip } from "react-native-zip-archive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
const Stack = createStackNavigator();
export default function Dashboard() {
  const [url, setUrl] = useState(`https://www.countymaterials.com/sso`);
  const [reload, setReload] = useState(false);
  const [visible, setVisible] = useState(true);
  const [modal, setModal] = useState(false);
  const [authToken, setAuthToken] = useState(undefined);
  const loaded = useRef(null);

  const webviewRef = useRef(null);

  const storeData = async (value) => {
    try {
      // const jsonValue = JSON.stringify(value)
      AsyncStorage.setItem("@storage_Key", `${value}`);
      let user = await AsyncStorage.getItem("@storage_Key");
      console.log("user", user);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    CookieManager.get("https://www.countymaterials.com").then((res) => {
      setAuthToken(res.auth_token); // => 'user_session=abcdefg; path=/;'
    });
  });

  const handleReload = () => {
    setReload(!reload);
    setUrl(
      `https://www.countymaterials.com/en/portal-dashbaord?${Math.random()}`
    );
  };

  function handleUrlWithZip(input, authToken) {
    const directoryFile = RNFS.DocumentDirectoryPath + "/DownloadFile";

    //Creating folder
    if (!RNFS.exists(directoryFile)) {
      RNFS.mkdir(directoryFile);
    }

    // If folder is created
    if (input) {
      const urlDownload = input;
      let fileName;
      try {
        fileName = urlDownload.substr(urlDownload.lastIndexOf("/")) + ".zip";

        if (fileName) {
          setTimeout(() => setModal(true), 3000);
        }
      } catch (e) {
        console.log(e);
        fileName = "example.zip";
      }

      let dirs = directoryFile + fileName;
      RNFetchBlob.config({
        // response data will be saved to this path if it has access right.
        path: dirs,
        trusty: true,
        fileCache: true,
      })
        .fetch("GET", urlDownload, {
          //some headers ..
          Authorization: `Basic ${authToken}`,
        })
        .progress((received, total) => {
          console.log("directory is:", dirs);
          console.log("authToken", authToken);
          console.log("progress", received / total);
        })
        .then((res) => {
          console.log("The file saved to ", res.path());
          console.log("The file saved to directoryFile", directoryFile);

          unzip(res.path(), directoryFile, "UTF-8")
            .then((path) => {
              console.log("unzip completed at", path);
            })
            .catch((error) => {
              console.error("unzip error", error);
            });
        });
    }
    hideSpinner();
  }

  const backButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goBack();
  };

  const reloadButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.reload();
  };

  const openLocalStorage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      await FileViewer.open(res.uri);
    } catch (e) {
      console.log("e", e);
    }
  };

  const customScript = `
		var link = document.createElement("link");
		link.href = "https://www.countymaterials.com/app.css?${Math.random()}";
		link.type = "text/css";
		link.rel = "stylesheet";	
		document.getElementsByTagName("head")[0].appendChild(link);
		true; // note: this is required, or you'll sometimes get silent failures
		var links = document.links, i, length;
    
		for (i = 0, length = links.length; i < length; i++) {
		links[i].target == '_blank' && links[i].removeAttribute('type'); 
		links[i].target == '_blank' && links[i].addEventListener("onmouseover", function() {
			console.log('Downlaod Clicked');
		});
		links[i].target == '_blank' && links[i].removeAttribute('target');
		}

		function setCookie(name, value, days) {
			var expires = "";
			if (days) {
			  var date = new Date();
			  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			  expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (value || "") + expires + "; path=/";
		  }
		  if(document.URL.indexOf("login") >= 0){ 
			  console.log("inside login");
			  var loginBtn = document.querySelector('#bottomlinks > div.control-group > div > button');
			  loginBtn.addEventListener('click', function (event) {
				  console.log("loginBtn click");
				  var username = document.getElementById('username').value;
				  var password = document.getElementById('password').value;
				  var auth_token = btoa(username + ":" + password);
				  setCookie('auth_token', auth_token, 100);
				  // setCookie('username', username, 100);
				  // setCookie('password', password, 100);
			  });
		  }
		window.ReactNativeWebView.postMessage("Hello!");
	`;

  function hideSpinner() {
    setVisible(false);
  }

  async function handleLinkPress(url) {
    const fileLink = url.split("/");
    if (
      fileLink[fileLink.length - 1] === "file" ||
      url.includes("view=download")
    ) {
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Fragment>
          {visible && loaded.current && (
            <View
              style={{
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <Image
                source={require("../assets/images/giphy.gif")}
                style={{ height: 200, width: 200 }}
              />
            </View>
          )}
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode={"compatibility"}
            startInLoadingState={true}
            ref={webviewRef}
            onLoadStart={() => {
              setVisible(true);
            }}
            source={{ uri: `${url}` }}
            // onNavigationStateChange={handleWebViewNavigationStateChange}
            injectedJavaScript={customScript}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            onLoad={hideSpinner}
            onShouldStartLoadWithRequest={(request) => {
              // Only allow navigating within this website
              console.log("Getting requested url is:", request.url);
              handleLinkPress(request.url);
              return true;
            }}
            onFileDownload={({ nativeEvent: { downloadUrl } }) => {
              console.log("Contents Data :", downloadUrl);
              handleUrlWithZip(downloadUrl, authToken);
            }}
            onMessage={() => customScript}
            // onMessage={customScript}
          />
        </Fragment>
        <View style={styles.tabBarContainer}>
          <TouchableOpacity onPress={backButtonHandler}>
            <Image
              source={require("../assets/images/arrow-back.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReload}>
            <Text style={styles.button}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reloadButtonHandler}>
            <Image
              source={require("../assets/images/refresh.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
        {modal && (
          <View style={styless.centeredView}>
            <Modal animationType="slide" transparent={true} visible={modal}>
              <View style={styless.centeredView}>
                <View style={styless.modalView}>
                  <Text
                    style={styless.modalText}
                  >{`File downloaded to your device`}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "flex-end",
                      marginRight: 0,
                      paddingLeft: 15,
                      paddingRight: 5,
                      justifyContent: "space-between",
                      display: "flex",
                    }}
                  >
                    <TouchableOpacity onPress={() => openLocalStorage()}>
                      <Text style={{ color: "blue", paddingRight: 15 }}>
                        View File
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModal(false)}>
                      <Text style={{ color: "blue" }}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            {/* <NavigationContainer
                ref={containerRef}
                initialState={initialNavigationState}> */}
            <Stack.Navigator>
              <Stack.Screen
                name="County Connect"
                component={BottomTabNavigator}
                options={{ headerTitleAlign: "center" }}
              />
            </Stack.Navigator>
            {/* </NavigationContainer> */}
          </View>
        )}
      </View>
    </View>
  );
}

const styless = StyleSheet.create({
  centeredView: {
    flex: 1,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    //   alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
