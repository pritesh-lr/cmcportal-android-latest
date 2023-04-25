import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import Info from '../screen/Info';
import DashBoard from '../screen/Dashboard';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({navigation, route}) {
  navigation.setOptions({headerTitle: getHeaderTitle(route)});

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Dashboard"
        component={DashBoard}
        options={{
          title: 'Portal',
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused} name="list" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Info"
        component={Info}
        options={{
          title: 'Info',
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused} name="info-circle" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'County Connect';
    case 'DashBoard':
      return 'Portal';
  }
}
