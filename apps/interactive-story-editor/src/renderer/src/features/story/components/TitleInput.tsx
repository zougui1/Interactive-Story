import { useSelector } from '@xstate/store/react';

import { Input } from '@renderer/components/Input';

import { storyStore } from '../story.store';

export const TitleInput = () => {
  const title = useSelector(storyStore, state => state.context.data.title);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    storyStore.trigger.updateTitle({ title: event.currentTarget.value });
  }

  return (
    <Input
      label="Title"
      onChange={handleChange}
      value={title}
      className="w-full"
      autoFocus
    />
  );
}
