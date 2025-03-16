import { Fragment, useEffect } from 'react';
import { useSelector } from '@xstate/store/react'

import { AppMarkdown } from '~/components/AppMarkdown';
import { Separator } from '~/components/Separator';

import { selectActs, storySaveStore } from '../storySave'
import { story } from '../story';

export const StoryText = () => {
  const acts = useSelector(storySaveStore, selectActs);
  const mainActs = acts.slice(0, -1);
  const lastAct = acts.at(-1);
  const currentScene = lastAct ? story.scenes[lastAct.scene.id] : story.scenes.root;

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight });
  }, [acts]);

  return (
    <Fragment>
      {mainActs.map((act, index) => (
        <Fragment key={index}>
          <AppMarkdown forceNewLines>{`\\> ${act.choice.text}`}</AppMarkdown>
          <AppMarkdown forceNewLines>{act.scene.text}</AppMarkdown>
        </Fragment>
      ))}

      {lastAct && (
        <>
          <Separator />
          <AppMarkdown forceNewLines>{`\\> ${lastAct.choice.text}`}</AppMarkdown>
        </>
      )}
    </Fragment>
  );
}
