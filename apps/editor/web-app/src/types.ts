export interface Scene {
  id: string;
  text: string;
  choices?: SceneChoice[];
}

export interface SceneChoice {
  id: string;
  type: ChoiceType;
  text: string;
  sceneId: string;
}

export interface SceneReference {
  count: number;
}

export enum ChoiceType {
  Branch = 'Branch',
  Jump = 'Jump',
}
