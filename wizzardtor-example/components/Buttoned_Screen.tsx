import { View, Text, Button } from "react-native";
import React from "react";
import { useWizardState } from "react-native-wizzardtor/lib";
import { useCustomWizzardState } from "./common/useCustomWizzardState";

const Buttoned_Screen = () => {
  const { navigateForward } = useCustomWizzardState();

  return (
    <View style={{}}>
      <Text>Buttoned_Screen</Text>
      <Button
        title="Go forward"
        onPress={() => {
          navigateForward();
        }}
      ></Button>
    </View>
  );
};

export default Buttoned_Screen;
