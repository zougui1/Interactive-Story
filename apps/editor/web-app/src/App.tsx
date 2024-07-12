import { StoryTree } from './features/story/components/StoryTree';

import { defaultScenes, defaultSceneIdStack, defaultSceneReferences } from './mock';

export const App = () => {
  return (
    <div className="flex justify-center container mx-auto pt-8">
      <StoryTree
        defaultScenes={defaultScenes}
        defaultSceneIdStack={defaultSceneIdStack}
        defaultSceneReferences={defaultSceneReferences}
      />
    </div>
  );
}
