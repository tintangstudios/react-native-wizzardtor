import { create } from "zustand";
import React from "react";

import { produce } from "immer";

//
export interface RouterStepProp<DataT = unknown | object> {
  component: React.ElementType;
  routeName: string;
  //default
  valid: boolean;
  // defaults to false, so that the client specify validation strategy
  useValidation?: boolean;
  // This function will be used when the useValidation is set and this one
  // is set to a valid function
  validateFunc?: (step: RouterStepProp<DataT>) => boolean;
  // If you want to store data on the wizzardState this is the way
  // note: maybe later support templating this field
  customData?: DataT;
}

//if you wish to modify the already registered route
export type RouterValidationMod = {
  //default
  valid?: boolean;
  // defaults to false, so that the client specify validation strategy
  useValidation?: boolean;
};

//
export interface RouterProps {
  steps: Array<RouterStepProp>;
  title: string;
}

//For implementing WizzardState for bmultiple types
export interface IWizzardStateCallbacks {
  // When every step change this is executed
  OnStepChanged?: (current: number, previous?: number) => void | unknown;
  // If the step validation is active, this is executed when the step is
  // going to go to the next step
  OnStepValidation?: (current: number, previous?: number) => boolean;
  // When the end is reached
  OnEnd?: (current: number) => void;
  //OnReset
  OnReset?: () => void;
}

// State for handling WizzardState
export interface IWizzardState<DataT = unknown | object> {
  // the current index of the steps
  currentStep: number;
  //steps passed when configuring the wizzard
  steps: Array<RouterStepProp<DataT>>;

  // Used to handle the flow for the end user of the class
  stateCallback: IWizzardStateCallbacks;

  //Initializes the state with the WizzardConfiguration
  initWithConf: (wConf: IWizzardConfiguration<DataT>) => void;

  //sets the step and the defaultStep number
  setWizardSteps: (
    stps: Array<RouterStepProp<DataT>>,
    defaultStep: number,
  ) => void;

  //Checks if the current step is valid
  isCurrentStepValid: () => boolean;
  //Set the valid property for the step
  setCurrentStepValid: (currentStep: number, valid: boolean) => void;

  //Navigate to an specific step
  goTo: (stepNumber: number) => boolean;
  //Navigate backwards
  goBack: () => boolean;
  //Navigate forward
  navigateForward: () => boolean;

  //validates if it can navigate
  canGoBack: () => boolean;
  //validates if it can navigate
  canGoForward: () => boolean;
  // Reset is stepNumber in range of the steps
  IsInRange: (stepNumber: number) => boolean;
}

//Configuration options
export type IWizzardConfiguration<DataT = unknown | object> = {
  steps: Array<RouterStepProp<DataT>>;
  defaultStep: number;
  callbacks: IWizzardStateCallbacks;
};

//Error definitions for state
export enum IWizzardErr {
  NULL_STATE = "",
}

// Uses a default implementation for state handling
export const USE_DEFAULT_STATE_IMPL = true;

export function createCustomWizzardState<DataT = unknown | object>() {
  return create<IWizzardState<DataT>>((set, get) => ({
    currentStep: 0,
    steps: [],
    stateCallback: USE_DEFAULT_STATE_IMPL ? ({} as IWizzardStateCallbacks) : {},

    initWithConf(wConf) {
      set(() => ({
        steps: wConf.steps,
        currentStep: wConf.defaultStep,
        stateCallback: wConf.callbacks,
      }));
    },
    setWizardSteps(stps, defaultStep: number = 0) {
      //TODO: validate if the defaultStep is in the range of the steps length
      set(() => ({
        steps: stps,
        currentStep: defaultStep,
      }));
    },

    isCurrentStepValid() {
      const state = get();
      if (state.steps.length >= state.currentStep) {
        return state.steps[state.currentStep].valid;
      }
      return false;
    },

    setCurrentStepValid(currentStep, valid = true) {
      const state = get();
      if (state.steps.length >= state.currentStep) {
        const curr = state.currentStep;
        set(
          produce<IWizzardState<DataT>>((st) => {
            st.steps[curr].valid = valid;
          }),
        );
      }
    },
    goTo(stepNumber) {
      //TODO: validate
      const state = get();
      if (
        state.stateCallback != null &&
        typeof state.stateCallback === "function"
      ) {
        if (get().stateCallback.OnStepChanged !== null) {
          return get().stateCallback.OnStepValidation?.(stepNumber) ?? false;
        }
      } else {
        return true;
      }
      return false;
    },
    canGoBack() {
      const state = get();
      const IndexValid = state.IsInRange(state.currentStep - 1);
      if (!IndexValid) return false;
      //TODO: add validation
      return true;
    },
    canGoForward() {
      const state = get();
      const IndexValid = state.IsInRange(state.currentStep + 1);
      if (!IndexValid) return false;

      //TODO: add validation
      return true;
    },
    goBack() {
      const state = get();
      const pStep = state.currentStep;
      const nStep = state.currentStep - 1;
      const IndexValid = state.IsInRange(nStep);

      if (!IndexValid) return false;

      const step = state.steps[nStep];
      if (step.useValidation && step.validateFunc != null) {
        if (step.validateFunc(step) == false) {
          return false;
        }
      }

      set(
        produce<IWizzardState<DataT>>((st) => {
          st.currentStep = nStep;
          state.stateCallback?.OnStepChanged?.(nStep, pStep);
        }),
      );
      return true;
    },
    navigateForward() {
      const state = get();
      const pStep = state.currentStep;
      const nStep = state.currentStep + 1;
      const IndexValid = state.IsInRange(nStep);

      if (!IndexValid) return false;

      const step = state.steps[nStep];
      if (step.useValidation && step.validateFunc != null) {
        if (step.validateFunc(step) == false) {
          return false;
        }
      }

      set(
        produce<IWizzardState<DataT>>((st) => {
          st.currentStep = nStep;
          state.stateCallback?.OnStepChanged?.(nStep, pStep);
        }),
      );

      return true;
    },
    IsInRange(stepNumber) {
      const state = get();
      return (
        state.steps.length > 0 &&
        stepNumber >= 0 &&
        stepNumber < state.steps.length
      );
    },
  }));
}

//Defaults
export const useWizardState = createCustomWizzardState();
