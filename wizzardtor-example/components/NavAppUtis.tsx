import { CommonActions, NavigationProp } from "@react-navigation/native";

export type AppScrName =
  | "start"
  | "signin"
  | "signup"
  | "forgotpassword"
  | "profile"
  | "appsettings"
  | "appviewer"
  | "appsearch"
  | "contact-el"
  | "onboard"
  | "editor";

export interface IAppScr {
  name: AppScrName;
  params?: any;
  reset?: boolean;
}

export const NavTo = (navigation: NavigationProp<any>, scrnDat: IAppScr) => {
  const { reset = false } = scrnDat;

  if (reset === false) {
    navigation.navigate(scrnDat.name, scrnDat.params);
  } else {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: scrnDat.name, params: scrnDat.params }],
      }),
    );
  }
};
