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
  choices: zod.array(zod.string()).optional(),
});

export type Scene = zod.infer<typeof sceneSchema>;

export const sceneReferenceSchema = zod.object({
  count: zod.number(),
});

export type SceneReference = zod.infer<typeof sceneReferenceSchema>;

export const statSchema = zod.object({
  id: zod.string(),
  name: zod.string().trim(),
  color: zod.string().trim(),
  startValue: zod.coerce.number().min(0),
  value: zod.coerce.number().min(0),
});

export type Stat = zod.infer<typeof statSchema>;

export const statReferenceSchema = zod.object({
  count: zod.number(),
});

export type StatReference = zod.infer<typeof statReferenceSchema>;

export const storySchema = zod.object({
  id: zod.string(),
  title: zod.string().min(1),
  scenes: zod.record(sceneSchema),
  choices: zod.record(sceneChoiceSchema),
  sceneIdStack: zod.array(zod.string()).min(1),
  sceneReferences: zod.record(sceneReferenceSchema),
  stats: zod.record(statSchema),
  statReferences: zod.record(statReferenceSchema),
});

export type Story = zod.infer<typeof storySchema>;
