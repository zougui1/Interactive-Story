import { SceneRoot, type SceneRootProps } from './SceneRoot';
import { SceneTextarea, type SceneTextareaProps } from './SceneTextarea';
import { SceneBadge, type SceneBadgeProps } from './SceneBadge';
import { SceneButton, type SceneButtonProps } from './SceneButton';

export const Scene = {
  Root: SceneRoot,
  Textarea: SceneTextarea,
  Badge: SceneBadge,
  Button: SceneButton,
};

export type {
  SceneRootProps,
  SceneTextareaProps,
  SceneBadgeProps,
  SceneButtonProps,
};
