import { useLinking } from '@react-navigation/native';
import { Alert, Button, Linking, StyleSheet, View } from "react-native";

export default function(containerRef) {
  return useLinking(containerRef, {
    config: {
      Root: {
        path: 'root',
        screens: {
          Home: 'home',
          Links: 'links',
          Settings: 'settings',
        },
      },
    },
  });
}
