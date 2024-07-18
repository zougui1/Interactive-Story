import { Button, type ButtonProps } from '@renderer/components/Button';
import { Dropdown } from '@renderer/components/Dropdown';

export const MenuButton = (props: MenuButtonProps) => {
  return (
    <Dropdown.Trigger asChild>
      <Button variant="ghost" {...props} />
    </Dropdown.Trigger>
  );
}

export interface MenuButtonProps extends ButtonProps {

}
