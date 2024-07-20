import zod from 'zod';

import { ChoiceType } from './enums';

export const sceneChoiceSchema = zod.object({
  id: zod.string(),
  text: zod.string(),
  type: zod.enum(Object.values(ChoiceType) as [ChoiceType, ...ChoiceType[]]),
  sceneId: zod.string(),
});

export type SceneChoice = zod.infer<typeof sceneChoiceSchema>;

export const sceneSchema = zod.object({
  id: zod.string(),
  text: zod.string(),
  choices: zod.array(sceneChoiceSchema).optional(),
});

export type Scene = zod.infer<typeof sceneSchema>;

export const sceneReferenceSchema = zod.object({
  count: zod.number(),
});

export type SceneReference = zod.infer<typeof sceneReferenceSchema>;

export const storySchema = zod.object({
  id: zod.string(),
  title: zod.string().min(1),
  scenes: zod.record(sceneSchema),
  sceneIdStack: zod.array(zod.string()).min(1),
  sceneReferences: zod.record(sceneReferenceSchema),
});

export type Story = zod.infer<typeof storySchema>;
