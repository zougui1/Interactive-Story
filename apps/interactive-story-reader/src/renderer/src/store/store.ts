import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { storySlice } from '@renderer/features/story/storySlice';

const persistConfig = {
  key: 'story',
  storage,
};

const persistedStoryReducer = persistReducer(persistConfig, storySlice.reducer);

const rootReducer = combineReducers({
  story: persistedStoryReducer,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        // disable the serializable check for the store persistence
        ignoredActions: ['persist/PERSIST'],
      }
    })
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
