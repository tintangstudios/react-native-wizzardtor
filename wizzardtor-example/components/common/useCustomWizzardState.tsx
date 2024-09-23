import { createCustomWizzardState } from "react-native-wizzardtor/lib";

export type CustomData = {
  isAlive: boolean;
  playerName: string;
};

export const useCustomWizzardState = createCustomWizzardState<CustomData>();
