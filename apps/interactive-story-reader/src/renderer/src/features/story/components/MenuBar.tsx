import { FileMenu } from './FileMenu';
import { Toolbar } from './Toolbar';

export const MenuBar = () => {
  return (
    <div className="sticky z-50 w-full top-0 region-drag select-none bg-black flex justify-between">
      <div>
        <FileMenu />
      </div>

      <div>
        <Toolbar />
      </div>
    </div>
  );
}
