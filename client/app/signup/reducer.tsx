import { Reducer } from "react";

export const defaultState = {
  username: "",
  password: "",
  passwordVerify: "",
  email: "",
  firstName: "",
  lastName: "",
  streetAddress: "",
  streetAddressTwo: "",
  city: "",
  planet: "",
  postalCode: "",
};

export enum SignUpFields {
  USERNAME = 'USERNAME',
  PASSWORD = 'PASSWORD',
  PASSWORDVERIFY = 'PASSWORDVERIFY',
  EMAIL = 'EMAIL',
  FIRSTNAME = 'FIRSTNAME',
  LASTNAME = 'LASTNAME',
  STREETADDRESS = 'STREETADDRESS',
  STREETADDRESSTWO = 'STREETADDRESSTWO',
  CITY = 'CITY',
  PLANET = 'PLANET',
  POSTALCODE = 'POSTALCODE',
}

interface Action {
  type: SignUpFields;
  payload: string;
}

const reducer: Reducer<SignUpForm, Action> = (state, action) => {
  switch(action.type) {
    case SignUpFields.USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    case SignUpFields.PASSWORD:
      return {
        ...state,
        password: action.payload,
      };
    case SignUpFields.PASSWORDVERIFY:
      return {
        ...state,
        passwordVerify: action.payload,
      };
    case SignUpFields.EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case SignUpFields.FIRSTNAME:
      return {
        ...state,
        firstName: action.payload,
      };
    case SignUpFields.LASTNAME:
      return {
        ...state,
        lastName: action.payload,
      };
    case SignUpFields.STREETADDRESS:
      return {
        ...state,
        streetAddress: action.payload,
      };
    case SignUpFields.STREETADDRESSTWO:
      return {
        ...state,
        streetAddressTwo: action.payload,
      };
    case SignUpFields.CITY:
      return {
        ...state,
        city: action.payload,
      };
    case SignUpFields.PLANET:
      return {
        ...state,
        planet: action.payload,
      };
    case SignUpFields.POSTALCODE:
      return {
        ...state,
        postalCode: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
