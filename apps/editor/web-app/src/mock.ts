import { nanoid } from 'nanoid';

import { Scene, ChoiceType } from './types';

export const defaultScenes = {
  aaaa: {
    id: 'aaaa',
    text: `As the days grow shorter and the air turns crisp, the beauty of autumn unfolds in a spectacular display of color. Leaves transition from the lush greens of summer to a vibrant palette of reds, oranges, and yellows, creating a tapestry of hues that blanket the landscape. The scent of fallen leaves mingles with the earth, evoking memories of cozy sweaters and warm drinks by the fire. Each step through the fallen foliage produces a satisfying crunch, a reminder of nature's cycle and the promise of renewal. Autumn is a season that invites reflection, a time to slow down and appreciate the fleeting beauty of nature's transformation.`,
    choices: [
      {
        id: nanoid(),
        type: ChoiceType.Branch,
        text: `Head towards the distant village in search of information or allies.`,
        sceneId: 'bbbb',
      },
      {
        id: nanoid(),
        type: ChoiceType.Branch,
        text: `Investigate the dark, ominous area, suspecting it holds the forest's secrets.`,
        sceneId: 'cccc',
      },
      {
        id: nanoid(),
        type: ChoiceType.Branch,
        text: `Make your way to the crystal-clear lake, hoping to find something valuable or refreshing.`,
        sceneId: 'dddd',
      },
    ],
  },
  bbbb: {
    id: 'bbbb',
    text: `Technology has revolutionized the field of education, offering unprecedented access to information and learning tools. With the advent of digital classrooms and online resources, students can now access a wealth of knowledge from anywhere in the world. Interactive software and educational apps provide personalized learning experiences, catering to individual needs and learning styles. Moreover, technology facilitates collaboration, allowing students and educators to connect and share ideas beyond geographical boundaries. Despite these advancements, it is crucial to address the digital divide and ensure equitable access to technology, so that all students can benefit from these educational innovations.`,
  },
  cccc: {
    id: 'cccc',
    text: `Mental health awareness is crucial in today's fast-paced and often stressful world. Recognizing the signs of mental health issues and seeking help early can prevent more severe problems and improve overall well-being. Stigmatizing mental illness only serves to isolate those in need, making it harder for them to reach out for support. By fostering an environment of understanding and compassion, society can encourage open conversations about mental health, reduce stigma, and provide better resources for those struggling. It's essential to remember that mental health is just as important as physical health, and taking care of the mind is a vital part of overall wellness.`,
  },
  dddd: {
    id: 'dddd',
    text: `Artficial Intelligence (AI) has come a long way since its inception, transforming industries and reshaping our daily lives. From early rule-based systems to advanced machine learning algorithms, AI has evolved to perform complex tasks with remarkable efficiency. In healthcare, AI assists in diagnosing diseases and personalizing treatment plans. In finance, it helps detect fraudulent activities and optimize trading strategies. Autonomous vehicles, powered by AI, promise to revolutionize transportation. As AI continues to advance, ethical considerations and regulatory frameworks will be essential to ensure that its benefits are maximized while minimizing potential risks. The future of AI holds immense potential, and its responsible development is key to harnessing its power for the greater good.`,
  },
} satisfies Record<string, Scene>;

export const defaultSceneReferences = {
  [defaultScenes.bbbb.id]: {
    count: 1,
  },
  [defaultScenes.cccc.id]: {
    count: 1,
  },
  [defaultScenes.dddd.id]: {
    count: 1,
  },
};

export const defaultTree = defaultScenes.aaaa satisfies Scene;
export const defaultSceneIdStack = [defaultScenes.aaaa.id];
