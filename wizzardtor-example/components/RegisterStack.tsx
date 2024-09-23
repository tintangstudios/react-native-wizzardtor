/// Register screen stack goes here
import { Dimensions, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

// screens

import { findIndex } from "lodash";

import Router, { navigationRef } from "./WizzardNavigationRouter";
import { useEffect, useState } from "react";
import { CommonActions } from "@react-navigation/native";

import {
  RouterProps,
  RouterStepProp,
  useWizardState,
} from "react-native-wizzardtor/lib";
import Buttoned_Screen from "./Buttoned_Screen";
import {
  CustomData,
  useCustomWizzardState,
} from "./common/useCustomWizzardState";

const Stack = createStackNavigator();

export default function RegisterStack() {
  const { initWithConf, setWizardSteps, steps, currentStep } =
    useCustomWizzardState();

  const [currentStepIndex, setcurrentStepIndex] = useState(0);

  var onHandleNavChange = (routeName: any) => {
    const currIndex = findIndex(steps, (step) => step.routeName === routeName);
    setcurrentStepIndex(currIndex);
  };

  const stepDefinition: Array<RouterStepProp<CustomData>> = [
    { component: Buttoned_Screen, routeName: "Step1", valid: true },
    {
      component: Buttoned_Screen,
      routeName: "Step2",
      valid: true,
      useValidation: true,
      validateFunc(step) {
        return true;
      },
    },
    {
      component: Buttoned_Screen,
      routeName: "Step3",
      valid: true,
    },
  ];

  useEffect(() => {
    initWithConf({
      steps: stepDefinition,
      defaultStep: 0,
      callbacks: {
        OnStepChanged(current, previous) {
          let nextStep = useCustomWizzardState.getState().steps[current];
          navigationRef.current?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: nextStep.routeName, params: {} }],
            }),
          );
        },
      },
    });
  }, []);

  return (
    <>
      {steps.length > 0 && (
        <Router
          // handleNavChange={onHandleNavChange}
          steps={steps}
          title={"Onboarding router"}
        />
      )}
    </>
  );
}
