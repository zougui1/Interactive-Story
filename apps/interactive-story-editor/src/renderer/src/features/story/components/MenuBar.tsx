import { FileMenu } from './FileMenu';

export const MenuBar = () => {
  return (
    <div className="sticky z-50 w-full top-0 region-drag select-none bg-black flex">
      <FileMenu />
    </div>
  );
}
