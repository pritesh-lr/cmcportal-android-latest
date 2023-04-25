import Icon from 'react-native-vector-icons/FontAwesome5';
import * as React from 'react';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <Icon
      name={props.name}
      size={20}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
