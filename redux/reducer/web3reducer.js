

import {
  Web_3_Object,
  WEB_3_CONNECTED,
  SET_META_MASK_ADDRESS,
  SET_SIGNER,
  SET_PROVIDER
} from "../constants";

const initialState = {
  web3object: null,
  metaMaskAddress: "",
  web3connected: false,
  signer: null,
  provider: null
};

const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case Web_3_Object:
      return {
        ...state,
        web3object: action.payload,
      };
    case WEB_3_CONNECTED:
      return {
        ...state,
        web3connected: action.payload,
      };

    case SET_META_MASK_ADDRESS:
      return {
        ...state,
        metaMaskAddress: action.payload,
      };
    case SET_SIGNER:
      return {
        ...state,
        signer: action.payload,
      };
      
    case SET_PROVIDER:
      return {
        ...state,
        provider: action.payload,
      };
            
    default:
      return state;
  }
};
export default web3Reducer;
