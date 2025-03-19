import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/AuthSlice';
import users from './slices/UserSlice';
import messages from './slices/MessageSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, auth);
const persistedUsersReducer = persistReducer(persistConfig, users);
const persistedMessagesReducer = persistReducer(persistConfig, messages);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: persistedUsersReducer,
    messages: persistedMessagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export default store;