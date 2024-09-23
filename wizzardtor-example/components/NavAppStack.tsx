/// Register screen stack goes here
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

// screens

import RegisterStack from "./RegisterStack";
const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();

export default function NavAppStack() {
  const [loaded, setLoaded] = useState<boolean>(true);

  return (
    <Stack.Navigator
      mode="card"
      screenOptions={{
        headerMode: "float",
      }}
      initialRouteName="onboard"
    >
      <Stack.Group
        screenOptions={
          {
            // presentation: "modal",
          }
        }
      >
        <Stack.Screen
          name="onboard"
          component={RegisterStack}
          options={
            {
              // header: null,
              // headerTransparent: true,
            }
          }
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
