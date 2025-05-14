# Interactive Story

This project is made of two applications, an editor and a reader.

## Editor

The editor is an executable made with Electron.
With the editor you can make a story. The story is composed of scenes, which have choices that point to other scenes.
Choices can either point to their own specific scene or jump to another scene that already exists.
The story can have stats of numeric values. The stats can either be shown or hidden from the reader.
A choice can have stat requirements, which can either be hidden from the user, disabled, or point to a specific "failure scene" if the reader's stats do not meet the requirements.
The author can save the story, open an existing one, or export it as HTML.

## Reader

The reader is an HTML file containing the UI and the data of the story.
The reader can also see their stats that weren't set to be hidden by the author.
When the reader does an action in the story, the data of the user's choices in the story are automatically saved in the browser's local storage.
The reader can go from one save to another at will.
The story ends when the reader reaches as scene that has no further choices.
