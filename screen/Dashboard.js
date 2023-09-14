import React, { useState, useRef, Fragment } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import styles from "./DashBoardStyle";
import Toast from "react-native-simple-toast";
import RNFetchBlob from "rn-fetch-blob";
var RNFS = require("react-native-fs");
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";

const { dirs } = RNFetchBlob.fs;

export default function Dashboard() {
  const webviewRef = useRef(null);
  const [url, setUrl] = useState(`https://www.countymaterials.com/sso`);
  const [visible, setVisible] = useState(true);
  const [modal, setModal] = useState(false);

  const handleReload = () => {
    setUrl("https://www.countymaterials.com/en/portal-dashboard");
  };

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

  const FileDownloadFilename = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.headers.has("content-disposition")) {
        const contentDisposition = response.headers.get("content-disposition");
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition
        );
        if (filenameMatch && filenameMatch[1]) {
          const filename = filenameMatch[1]
            .replace(/['"]/g, "")
            .replace(" ", "_");
          return filename;
        }
      } else {
        console.log("Content-Disposition header not found");
        setVisible(false);
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLinkPress = async (url) => {
    const fileLink = url.split("/");
    if (fileLink[fileLink.length - 1] === "file") {
      // Single file download
      const dirToSave =
        Platform.OS == "ios" ? dirs.DocumentDir : dirs.DownloadDir;
      const fileName = await FileDownloadFilename(url);
      if (fileName) {
        const configs = {
          useDownloadManager: false,
          notification: false,
          mediaScannable: false,
          title: fileName,
          path: `${dirToSave}/${fileName}`,
        };

        await RNFS?.exists(configs?.path).then(async (exists) => {
          if (exists) {
            setVisible(false);
            Toast.show(`File already exists!`, Toast.LONG, Toast.BOTTOM);
          } else {
            await RNFetchBlob?.config(configs)
              .fetch("GET", url, {})
              .then((res) => {
                if (Platform.OS == "android") {
                  Toast.show(
                    `File downloaded ${configs.path}`,
                    Toast.LONG,
                    Toast.BOTTOM
                  );
                  setVisible(false);
                  Alert.alert(
                    "Succeed!",
                    "Your file has been downloaded successfully"
                  );
                }
                setVisible(false);
              });
          }
        });
      } else {
        setVisible(false);
      }
    } else if (url.includes("view=download")) {
      // Multiple file download
      const dirToSave =
        Platform.OS == "ios" ? dirs.DocumentDir : dirs.DownloadDir;
      const fileName = `${Math.round(+new Date() / 1000)}.zip`;
      const configs = {
        useDownloadManager: false,
        notification: false,
        mediaScannable: true,
        title: fileName,
        path: `${dirToSave}/${fileName}`,
      };

      await RNFS?.exists(configs?.path).then(async (exists) => {
        if (exists) {
          setVisible(false);
          Toast.show(`File already exists!`, Toast.LONG, Toast.BOTTOM);
        } else {
          await RNFetchBlob.config(configs)
            .fetch("GET", url, {})
            .then((res) => {
              if (Platform.OS == "android") {
                Toast.show(
                  `File downloaded ${configs.path}`,
                  Toast.LONG,
                  Toast.BOTTOM
                );
                setVisible(false);
                Alert.alert(
                  "Succeed!",
                  "Your file has been downloaded successfully"
                );
              }
              setVisible(false);
            });
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Fragment>
          {visible && (
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
                style={{ height: 100, width: 100 }}
              />
            </View>
          )}
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode={"compatibility"}
            startInLoadingState={true}
            ref={webviewRef}
            source={{
              uri: url,
            }}
            androidLayerType="hardware"
            injectedJavaScript={customScript}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            onShouldStartLoadWithRequest={(request) => {
              console.log("request.url", request.url);
              setVisible(true);
              handleLinkPress(request.url);
              return true;
            }}
            onLoadEnd={(e) => {
              setUrl(e?.nativeEvent?.url);
              setVisible(false);
            }}
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
