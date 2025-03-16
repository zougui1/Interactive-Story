import { Story } from './Story';
import { DesktopMenuBar } from '../components/DesktopMenuBar';
import { MobileMenuBar } from '../components/MobileMenuBar';

export const StoryMain = () => {
  return (
    <div className="[--header-height:40px]">
      <DesktopMenuBar className="max-md:hidden" />
      <MobileMenuBar className="md:hidden" />

      <div className="pt-8 min-h-[calc(100vh-var(--header-height))]">
        <Story />
      </div>
    </div>
  );
}
