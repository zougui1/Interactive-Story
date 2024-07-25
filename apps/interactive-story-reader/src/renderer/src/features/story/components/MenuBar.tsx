import { useAppSelector } from '@renderer/store';

import { FileMenu } from './FileMenu';
import { ViewMenu } from './ViewMenu';
import { Toolbar } from './Toolbar';

export const MenuBar = () => {
  const hasStory = useAppSelector(state => Boolean(state.story.data));

  return (
    <div className="sticky z-50 w-full top-0 region-drag select-none bg-black flex justify-between">
      <div>
        <FileMenu />
        {hasStory && <ViewMenu />}
      </div>

      <div>
        <Toolbar />
      </div>
    </div>
  );
}
