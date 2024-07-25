import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import { StoryMain } from './features/story/screens/StoryMain';
import { store, persistor } from './store';

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StoryMain />

        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={false}
          bodyClassName="items-start"
          toastClassName="bg-slate-900"
        />
      </PersistGate>
    </Provider>
  );
}
