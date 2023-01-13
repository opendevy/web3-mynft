import {
  Web_3_Object,
  WEB_3_CONNECTED,
  SET_META_MASK_ADDRESS,
  SET_SIGNER,
  SET_PROVIDER
} from "../constants";

export const setMetaMask = (content) => ({
  type: SET_META_MASK_ADDRESS,
  payload: content,
});

export function setWeb3Object(value) {
  return {
    type: Web_3_Object,
    payload: value,
  };
}

export function setWeb3Connected(value) {
  return {
    type: WEB_3_CONNECTED,
    payload: value,
  };
}


export function setSigner(value) {
  return {
    type: SET_SIGNER,
    payload: value,
  };
}

export function setProvider(value) {
  return {
    type: SET_PROVIDER,
    payload: value,
  };
}
