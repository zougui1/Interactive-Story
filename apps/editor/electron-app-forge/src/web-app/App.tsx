import { Provider } from 'react-redux';

import { Story } from './features/story/screens/Story';
import { store } from './store';

export const App = () => {
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
}
