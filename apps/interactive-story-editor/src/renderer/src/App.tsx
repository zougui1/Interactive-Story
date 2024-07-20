import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { Story } from './features/story/screens/Story';
import { store } from './store';

export const App = () => {
  return (
    <Provider store={store}>
      <Story />

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={10_000}
        bodyClassName="items-start"
        toastClassName="bg-slate-900"
      />
    </Provider>
  );
}
