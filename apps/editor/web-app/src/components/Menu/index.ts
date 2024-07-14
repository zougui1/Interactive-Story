import { Dropdown } from '~/components/Dropdown';

import { MenuItem, type MenuItemProps } from './MenuItem';
import { MenuButton, type MenuButtonProps } from './MenuButton';

export const Menu = {
  Root: Dropdown.Root,
  Content: Dropdown.Content,
  Group: Dropdown.Group,
  Separator: Dropdown.Separator,
  Item: MenuItem,
  Button: MenuButton,
};

export type {
  MenuItemProps,
  MenuButtonProps,
};
