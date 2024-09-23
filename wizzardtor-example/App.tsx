import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
import { navigationRef } from "@/components/WizzardNavigationRouter";
import NavAppStack from "@/components/NavAppStack";
enableScreens();

export const AppRoot = ({}) => {
  const [isLoadingComplete, setisLoadingComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([]);
      } catch (e) {
        console.warn(e);
      } finally {
        setisLoadingComplete(true);
      }
    }

    prepare();
  }, []);

  return (
    <GestureHandlerRootView>
      <NavigationContainer ref={navigationRef}>
        <NavAppStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
