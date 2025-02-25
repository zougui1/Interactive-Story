import { ToastContainer } from 'react-toastify';

import { Story } from './features/story/screens/Story';

export const App = () => {
  return (
    <>
      <Story />

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={10_000}
        bodyClassName="items-start"
        toastClassName="bg-slate-900"
      />
    </>
  );
}
