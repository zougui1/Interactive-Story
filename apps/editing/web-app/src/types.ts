export interface Story {
  id: string;
  text: string;
  choices?: StoryChoice[];
}

export interface StoryChoice {
  text: string;
  story: Story;
}
