import { forwardRef } from 'react';

import { Button, type ButtonProps } from '~/components/Button';

import { SceneBadge, type SceneBadgeProps } from './SceneBadge';

export const SceneButton = forwardRef<HTMLButtonElement, SceneButtonProps>(({ position, showOnHoverOnly, ...rest }, ref) => {
  return (
    <SceneBadge position={position} showOnHoverOnly={showOnHoverOnly} asChild>
      <Button
        variant="ghost"
        {...rest}
        ref={ref}
      />
    </SceneBadge>
  );
});

SceneButton.displayName = 'SceneButton';

export interface SceneButtonProps extends SceneBadgeProps, ButtonProps {

}
