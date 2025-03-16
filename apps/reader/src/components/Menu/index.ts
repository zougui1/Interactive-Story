import { Dropdown } from '~/components/Dropdown';

import { MenuItem, type MenuItemProps } from './MenuItem';
import { MenuCheckboxItem, type MenuCheckboxItemProps } from './MenuCheckboxItem';
import { MenuButton, type MenuButtonProps } from './MenuButton';

export const Menu = {
  Root: Dropdown.Root,
  Content: Dropdown.Content,
  Group: Dropdown.Group,
  Separator: Dropdown.Separator,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  Button: MenuButton,
};

export type {
  MenuItemProps,
  MenuCheckboxItemProps,
  MenuButtonProps,
};
