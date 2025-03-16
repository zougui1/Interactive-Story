import clsx from 'clsx';

import { Dropdown, type DropdownMenuItemProps } from '@renderer/components/Dropdown';

export const MenuItem = ({ children, shortcut, ...rest }: MenuItemProps) => {
  return (
    <Dropdown.Item {...rest}>
      <span className={clsx(shortcut && 'mr-4')}>
        {children}
      </span>

      {shortcut && (
        <Dropdown.Shortcut className="capitalize">
          {shortcut}
        </Dropdown.Shortcut>
      )}
    </Dropdown.Item>
  );
}

export interface MenuItemProps extends DropdownMenuItemProps {
  shortcut?: string;
}
