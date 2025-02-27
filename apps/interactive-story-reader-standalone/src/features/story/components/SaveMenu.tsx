import { useSelector } from '@xstate/store/react';
import { Trash2 } from 'lucide-react';

import { Menu } from '~/components/Menu';
import { Button } from '~/components/Button';

import { storySaveStore, usePersistedSaves, StorySave } from '../storySave';

export const SaveMenu = () => {
  const currentStorySave = useSelector(storySaveStore, state => state.context);
  const [persistedSavesMap, setPersistedSaves] = usePersistedSaves();

  const persistedSaves = persistedSavesMap[currentStorySave.id]
    ? Object.values(persistedSavesMap)
    : [...Object.values(persistedSavesMap), currentStorySave];

  const openSave = (save: StorySave) => {
    storySaveStore.trigger.set({ save });
  }

  const deleteSave = (save: StorySave) => {
    setPersistedSaves(prevPersistedSaves => {
      const newPersistedSaves = { ...prevPersistedSaves };
      delete newPersistedSaves[save.id];

      return newPersistedSaves;
    });
  }

  const handleDelete = (save: StorySave) => (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteSave(save);
  }

  return (
    <Menu.Root>
      <Menu.Button>Saves</Menu.Button>

      <Menu.Content>
        <Menu.Group>
          {persistedSaves.map((save, index) => (
            <Menu.Item
              key={save.id}
              disabled={save.id === currentStorySave.id}
              onClick={() => openSave(save)}
              wrapperClassName="flex items-center"
            >
              <span>
                Save #{index + 1}{save.id === currentStorySave.id
                  ? ' | current'
                  : ` | ${save.date.toLocaleString()}`
                }
              </span>

              <span>
                <Button
                  variant="ghost"
                  className="w-7 h-7 p-0 ml-2 rounded-full"
                  onClick={handleDelete(save)}
                >
                  <Trash2 className="h-5 text-destructive" />
                </Button>
              </span>
            </Menu.Item>
          ))}
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  );
}
