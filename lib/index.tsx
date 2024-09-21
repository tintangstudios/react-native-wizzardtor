// Your main export will be here
import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useWizardState } from "./WizzardState";

export default function VarComp() {
  return (
    <View>
      <Text>index</Text>
    </View>
  );
}

export { useWizardState, VarComp };
