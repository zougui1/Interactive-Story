import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createStore } from '@xstate/store';
import useLocalStorage from 'use-local-storage';
import { produce } from 'immer';

import { catchError } from '~/utils';
import { Story } from '@zougui/interactive-story.story';

const savesStorageKey = 'saves';

export const storySaveStore = createStore({
  context: {
    id: nanoid(),
    date: new Date(),
    stats: {},
    acts: [],
  } as StorySave,

  emits: {
    persistSave: ({ save }: { save: StorySave }) => {
      const value = window.localStorage.getItem(savesStorageKey);
      const saves = value ? parseSaves(value) : {};

      const newSaves = {
        ...saves,
        [save.id]: save,
      };

      window.localStorage.setItem(savesStorageKey, JSON.stringify(newSaves));
    },
  },

  on: {
    init: (context, event: { story: Story }) => {
      const stats: Record<string, Stat> = {};

      for (const stat of Object.values(event.story.stats)) {
        stats[stat.id] = {
          id: stat.id,
          name: stat.name,
          color: stat.color,
          value: stat.startValue,
        };
      }

      return {
        ...context,
        stats,
      };
    },

    restart: (context, event: { story: Story }, enqueue) => {
      const stats: Record<string, Stat> = {};

      for (const stat of Object.values(event.story.stats)) {
        stats[stat.id] = {
          id: stat.id,
          name: stat.name,
          color: stat.color,
          value: stat.startValue,
        };
      }

      const updatedContext = {
        id: context.id,
        date: new Date(),
        stats,
        acts: [],
      };

      enqueue.emit.persistSave({
        save: updatedContext,
      });

      return updatedContext;
    },

    set: (_context, { save }: { save: StorySave; }) => {
      return save;
    },

    addAct: (context, event: { choiceId: string; targetId: string; }, enqueue) => {
      const updatedContext = {
        ...context,
        acts: [
          ...context.acts,
          event,
        ],
      };

      enqueue.emit.persistSave({
        save: updatedContext,
      });

      return updatedContext;
    },

    incrementStats: (context, event: { stats: Record<string, number> }) => {
      return produce(context, draft => {
        for (const [id, value] of Object.entries(event.stats)) {
          const stat = draft.stats[id];

          if (stat) {
            stat.value = Math.max(0, stat.value + value);
          }
        }
      });
    },
  },
});

export const actSchema = z.object({
  choiceId: z.string(),
  targetId: z.string(),
});

export const statSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  value: z.number(),
});

export const storySaveSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  stats: z.record(statSchema),
  acts: z.array(actSchema),
});

export type StorySave = z.infer<typeof storySaveSchema>;
export type Stat = z.infer<typeof statSchema>;

const parseSaves = (value: string): Record<string, StorySave> => {
  const [jsonError, rawSaves] = catchError(() => JSON.parse(value));

  if (jsonError || !rawSaves || typeof rawSaves !== 'object') {
    return {};
  }

  const persistedSaves: Record<string, StorySave> = {};

  for (const rawSave of Object.values(rawSaves)) {
    const result = storySaveSchema.safeParse(rawSave);

    if (result.success) {
      persistedSaves[result.data.id] = result.data;
    }
  }

  return persistedSaves;
}

export const usePersistedSaves = (): [Record<string, StorySave>, React.Dispatch<React.SetStateAction<Record<string, StorySave> | undefined>>] => {
  return useLocalStorage<Record<string, StorySave>>(savesStorageKey, {}, {
    parser: (value: string): Record<string, StorySave> => {
      return parseSaves(value);
    }
  });
}
