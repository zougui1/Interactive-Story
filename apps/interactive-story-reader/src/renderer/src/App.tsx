import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { StoryMain } from './features/story/screens/StoryMain';
import { store } from './store';

export const App = () => {
  return (
    <Provider store={store}>
      <StoryMain />

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={false}
        bodyClassName="items-start"
        toastClassName="bg-slate-900"
      />
    </Provider>
  );
}
