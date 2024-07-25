import clsx from 'clsx';

import { Dropdown, type DropdownMenuCheckboxItemProps } from '@renderer/components/Dropdown';

export const MenuCheckboxItem = ({ children, shortcut, ...rest }: MenuCheckboxItemProps) => {
  return (
    <Dropdown.CheckboxItem {...rest}>
      <span className={clsx(shortcut && 'mr-4')}>
        {children}
      </span>

      {shortcut && (
        <Dropdown.Shortcut className="capitalize">
          {shortcut}
        </Dropdown.Shortcut>
      )}
    </Dropdown.CheckboxItem>
  );
}

export interface MenuCheckboxItemProps extends DropdownMenuCheckboxItemProps {
  shortcut?: string;
}
