import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = (reducer: any) => {
  return persistReducer(persistConfig, reducer);
};

export default persistedReducer;