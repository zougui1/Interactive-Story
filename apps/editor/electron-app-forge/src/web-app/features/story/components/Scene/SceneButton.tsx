import { forwardRef } from 'react';

import { SceneBadge, type SceneBadgeProps } from './SceneBadge';
import { Button, type ButtonProps } from '../../../../components/Button';

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
