import { Button, type ButtonProps } from '~/components/Button';
import { Dropdown } from '~/components/Dropdown';

export const MenuButton = (props: MenuButtonProps) => {
  return (
    <Dropdown.Trigger asChild>
      <Button variant="ghost" {...props} />
    </Dropdown.Trigger>
  );
}

export interface MenuButtonProps extends ButtonProps {

}
