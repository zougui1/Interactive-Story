import { useState } from 'react';

import { Textarea } from '~/components/Textarea';

import { StoryPartProvider } from './context';

export const StoryPartRoot = ({ text, onChange, children }: StoryPartRootProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <StoryPartProvider hovered={hovered}>
      <div
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex-none relative size-56 border border-slate-300 rounded py-7 px-4 bg-slate-900"
      >
        {children}

        <Textarea className="h-full" value={text} onChange={onChange} />
      </div>
    </StoryPartProvider>
  );
}

export interface StoryPartRootProps {
  text: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  children?: React.ReactNode;
}
