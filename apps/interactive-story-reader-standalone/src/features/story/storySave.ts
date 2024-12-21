import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import useLocalStorage from 'use-local-storage';

import { catchError } from '~/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StorySave extends z.infer<typeof storySaveSchema> {

}

export interface StorySaveState extends StorySave {
  set: (save: StorySave) => void;
  addChoiceId: (choiceId: string) => void;
}

export const useStorySave = create<StorySaveState>(set => ({
  id: nanoid(),
  date: new Date(),
  choiceIds: [],
  set: (save: StorySave) => set(save),
  addChoiceId: (choiceId: string) => set(state => ({ choiceIds: [...state.choiceIds, choiceId] })),
}));

export const storySaveSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  choiceIds: z.array(z.string()),
});

export const usePersistedSaves = (): [Record<string, StorySave>, React.Dispatch<React.SetStateAction<Record<string, StorySave> | undefined>>] => {
  return useLocalStorage<Record<string, StorySave>>('saves', {}, {
    parser: (value: string): Record<string, StorySave> => {
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
  });
}
