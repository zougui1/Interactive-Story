import { Button, type ButtonProps } from '../Button';
import { Dropdown } from '../Dropdown';

export const MenuButton = (props: MenuButtonProps) => {
  return (
    <Dropdown.Trigger asChild>
      <Button variant="ghost" {...props} />
    </Dropdown.Trigger>
  );
}

export interface MenuButtonProps extends ButtonProps {

}
