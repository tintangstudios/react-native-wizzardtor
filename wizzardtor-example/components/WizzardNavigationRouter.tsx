import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useState,
} from "react";

import { last } from "lodash";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, View, BackHandler } from "react-native";
import {
  createNavigationContainerRef,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import {} from "react-native";
import useUpdateEffect from "react-use/lib/useUpdateEffect";
import { HeaderBackButton } from "@react-navigation/elements";
import {
  RouterProps,
  RouterStepProp,
  useWizardState,
} from "react-native-wizzardtor/lib";
import { useCustomWizzardState } from "./common/useCustomWizzardState";

const StackRouterNav = createStackNavigator();

type Ref = typeof StackRouterNav;
export const navigationRef = createNavigationContainerRef();

const WizzardNavigationRouter = (props: RouterProps) => {
  const { steps, title } = props;

  const [laoded, setlaoded] = useState(false);
  useEffect(() => {
    setlaoded(true);
    return () => {};
  }, []);

  // useEffect(() => {
  //   let backHandler = BackHandler.addEventListener('hardwareBackPress', function () { return true })
  //   return () => {
  //     backHandler.remove()
  //   };
  // }, [])

  return (
    <>
      {laoded && (
        <StackRouterNav.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#ffffff",
              paddingHorizontal: 5,
            },
            headerTintColor: "#111111",
            headerTitle: title,
          }}
        >
          {/* {laoded && (StackRouterNav.Navigator.defaultProps.children)} */}

          {steps &&
            steps.map((e) => (
              <StackRouterNav.Screen
                key={e.routeName}
                name={e.routeName}
                component={() => (
                  <WizzardBodyComponent
                    routeName={e.routeName}
                    ComponentBody={e.component}
                    Step={e}
                  />
                )}
                options={{
                  headerTitle: e.routeName + "S",
                  // headerTransparent: true,

                  // gestureEnabled: false,
                }}
              />
            ))}

          {!laoded && (
            <StackRouterNav.Screen
              name="start"
              component={FCOMP}
              options={{
                title: "DUDE",
                headerTransparent: true,
              }}
            />
          )}
        </StackRouterNav.Navigator>
      )}
    </>
  );
};

//Customizable screen
export type WizzardNavStackScreenProps = {
  routeName: string;
  ComponentBody: React.ElementType;
  Step: RouterStepProp;
};

//
export function WizzardBodyComponent(props: WizzardNavStackScreenProps) {
  const navigation = useNavigation();

  const { routeName, ComponentBody, Step } = props;

  const { canGoBack, goBack } = useCustomWizzardState();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Screen was focused
      // Do something
      console.log("Focus on = ", routeName);
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(() => {
    navigation.setOptions({
      title: ",",

      headerLeft: () => {
        return (
          <HeaderBackButton
            disabled={canGoBack() === false}
            onPress={() => {
              goBack();
            }}
          />
        );
      },
    });
  });

  return (
    <>
      <Button
        title=" PRESS ME"
        onPress={() => {
          navigation.setOptions({
            title: ",",

            headerLeft: () => <HeaderBackButton />,
          });
        }}
      ></Button>
      <ComponentBody />
    </>
  );
}

const FCOMP = () => {
  return (
    <View
      style={{
        backgroundColor: "red",
        height: 80,
        width: 80,
      }}
    />
  );
};

export default WizzardNavigationRouter;
