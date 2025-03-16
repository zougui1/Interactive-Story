import { StoryChoiceMenu } from '../components/StoryChoiceMenu';
import { StoryText } from '../components/StoryText';
import { ReplayButton } from '../components/ReplayButton';
import { DesktopStoryStats } from '../components/DesktopStoryStats';
import { FadingTextContainer } from '../components/FadingTextContainer';
import { RootScene } from '../components/RootScene';
import { story } from '../story';
import { CurrentScene } from '../components/CurrentScene';

export const Story = () => {
  return (
    <div className="container w-screen box-border px-4 md:max-3xl:pl-44 3xl:mx-auto">
      <h1 className="text-5xl font-bold text-center mb-8">
        {story.title}
      </h1>

      <DesktopStoryStats />

      <div className="flex flex-col justify-between space-y-12 pb-4 md:pb-12 text-white">
        <div className="space-y-4">
          <FadingTextContainer className="space-y-4">
            <RootScene />
            <StoryText />
          </FadingTextContainer>

          <CurrentScene />
        </div>

        <StoryChoiceMenu />
        <ReplayButton />
      </div>
    </div>
  );
}
