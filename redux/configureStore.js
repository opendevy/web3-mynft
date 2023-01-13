import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import web3Reducer from "../redux/reducer/web3reducer";
import { composeWithDevTools } from "redux-devtools-extension";


const middleware = [thunk, routerMiddleware()];

export const rootReducer = () =>
  combineReducers({
    web3: web3Reducer
  });

const Store = createStore(
  rootReducer(),
  composeWithDevTools(applyMiddleware(...middleware))
);
export default Store;

