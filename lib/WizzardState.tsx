import { create } from "zustand";
import React from "react";

import { produce } from "immer";

//
export interface RouterStepProp {
  component: React.ElementType;
  routeName: string;
  //default
  valid: boolean;
  // defaults to false, so that the client specify validation strategy
  useValidation?: boolean;
  // This function will be used when the useValidation is set and this one
  // is set to a valid function
  validateFunc?: (step: RouterStepProp) => boolean;
  // If you want to store data on the wizzardState this is the way
  // note: maybe later support templating this field
  customData?: any | object;
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
  OnStepChanged?: (current: number, previous?: number) => void | any;
  // If the step validation is active, this is executed when the step is
  // going to go to the next step
  OnStepValidation?: (current: number, previous?: number) => boolean;
  // When the end is reached
  OnEnd?: (current: number) => void;
  //OnReset
  OnReset?: () => void;
}

// State for handling WizzardState
export interface IWizzardState {
  // the current index of the steps
  currentStep: number;
  //steps passed when configuring the wizzard
  steps: Array<RouterStepProp>;

  // Used to handle the flow for the end user of the class
  stateCallback: IWizzardStateCallbacks;

  //Initializes the state with the WizzardConfiguration
  initWithConf: (wConf: IWizzardConfiguration) => void;

  //sets the step and the defaultStep number
  setWizardSteps: (stps: Array<RouterStepProp>, defaultStep: number) => void;

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
export type IWizzardConfiguration = {
  steps: Array<RouterStepProp>;
  defaultStep: number;
  callbacks: IWizzardStateCallbacks;
};

//Error definitions for state
export enum IWizzardErr {
  NULL_STATE = "",
}

// Uses a default implementation for state handling
export const USE_DEFAULT_STATE_IMPL = true;

//
export const useWizardState = create<IWizzardState>((set, get) => ({
  currentStep: 0,
  steps: [],
  stateCallback: USE_DEFAULT_STATE_IMPL ? ({} as IWizzardStateCallbacks) : {},

  initWithConf(wConf) {
    set((state) => ({
      steps: wConf.steps,
      currentStep: wConf.defaultStep,
      stateCallback: wConf.callbacks,
    }));
  },
  setWizardSteps(stps, defaultStep: number = 0) {
    //TODO: validate if the defaultStep is in the range of the steps length
    set((state) => ({
      steps: stps,
      currentStep: defaultStep,
    }));
  },

  isCurrentStepValid() {
    var state = get();
    if (state.steps.length >= state.currentStep) {
      return state.steps[state.currentStep].valid;
    }
    return false;
  },

  setCurrentStepValid(currentStep, valid = true) {
    var state = get();
    if (state.steps.length >= state.currentStep) {
      const curr = state.currentStep;
      set(
        produce((st: IWizzardState) => {
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
    var state = get();
    let IndexValid = state.IsInRange(state.currentStep - 1);
    if (!IndexValid) return false;
    //TODO: add validation
    return true;
  },
  canGoForward() {
    var state = get();
    let IndexValid = state.IsInRange(state.currentStep + 1);
    if (!IndexValid) return false;

    //TODO: add validation
    return true;
  },
  goBack() {
    var state = get();
    var pStep = state.currentStep;
    var nStep = state.currentStep - 1;
    let IndexValid = state.IsInRange(nStep);

    if (!IndexValid) return false;

    let step = state.steps[nStep];
    if (step.useValidation && step.validateFunc != null) {
      if (step.validateFunc(step) == false) {
        return false;
      }
    }

    set(
      produce((st: IWizzardState) => {
        st.currentStep = nStep;
        state.stateCallback?.OnStepChanged?.(nStep, pStep);
      }),
    );
    return true;
  },
  navigateForward() {
    var state = get();
    var pStep = state.currentStep;
    var nStep = state.currentStep + 1;
    let IndexValid = state.IsInRange(nStep);

    if (!IndexValid) return false;

    let step = state.steps[nStep];
    if (step.useValidation && step.validateFunc != null) {
      if (step.validateFunc(step) == false) {
        return false;
      }
    }

    set(
      produce((st: IWizzardState) => {
        st.currentStep = nStep;
        state.stateCallback?.OnStepChanged?.(nStep, pStep);
      }),
    );

    return true;
  },
  IsInRange(stepNumber) {
    var state = get();
    return (
      state.steps.length > 0 &&
      stepNumber >= 0 &&
      stepNumber < state.steps.length
    );
  },
}));
