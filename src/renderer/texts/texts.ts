export const info =
`# Elementary

Elementary is a simple markdown editor built by [bogosorter](https://bogosorter.github.io).



## Getting started

If you're in a hurry, start typing right away: Elementary is fairly intuitive.

For more info on the markdown elements and Elementary shortcuts, check the command palette using the settings icon to your left or \`ctrl+p\`. If you'd like to know a little more about how Elementary came to be, read on!



## Background

I loved Typora's editing experience, but it has since become a paid app... On the lookout for an alternative, I used Marktext - an open-source app - for a while, but it proved itself to be somewhat buggy. After many more frustrated attempts, I turned to VS Code. Though not aesthetically pleasing, VS Code was reliable and met my needs.

Then, I learnt that VS Code's core editor, Monaco, was open-source. That's when the idea of adapting Monaco to fit my needs came to be. The core of Elementary is based on Monaco and should provide a reliable and bug-free experience. I did, however, change all of the editor's styles for aesthetic's sake, and built the logic that makes this a standalone app. Elementary uses electron and react, put together by the electron-react-boilerplate.

Currently, I have yet to implement a spell-checker and a pdf exporter. I hope to tackle both of those soon.

I hope you enjoy Elementary!

bogosorter

P.S.: Those quotes took a really long time to implement, you should check them out!

P.P.S.: If you got this far, you deserve a treat. I am a huge fan of clean interfaces and, since you're using Elementary, I'm guessing you are too. You can use the command palette to set the interface complexity to Minimal, as I do. Beware: you mustn't forget the shortcut to open the command palette since that's where the app's logic resides.



## Acknowledgements

I must thank [comma](https://github.com/useyourcommas) for her precious help. She reviewed almost every detail in the app, patiently heard my chatter about it and designed Elementary's logo. Elementary would be a different app without her.



## Get in touch

I'd love to get some feedback from you. A thumbs up, a critique, a feature request or (that'd be a dream come true) a pull request. All of those are welcome.

- I can be reached at \`luiswbarbosa@gmail.com\`
- [This](https://github.com/bogosorter/elementary) is Elementary's repository
- You can open GitHub issues [here](https://github.com/bogosorter/elementary/issues)

Happy writing!

`;

export const markdown =
`# Markdown syntax

Elementary supports all standard markdown elements. Here's a quick refresher:

- **Bold** text is surrounded with two \`*\` or two \`_\`
- *Italic* text is surrounded with one \`*\` or one \`_\`
- List items start with a single \`-\`
- ~~Strikethrough~~ text is surrounded with two \`~\`
- ==Highlighted== text is surrounded with two \`=\`
- Quotes start with a \`>\`
- Inline code is surrounded with a backtick
- Links are formated like [this](https://example.com)
- Headings use a variable number of hashtags: \`##\` is a level two heading and \`###\` is a level 3 heading.

For further syntax elements check [this guide](https://www.markdownguide.org/cheat-sheet/).
`;

export const shortcuts =
`# Shortcuts

Elementary defines the following shortcuts:

- Command palette - \`ctrl+p\`, \`ctrl+shift+p\`, \`ctrl+k\` or \`esc\`
- Open file - \`ctrl+o\`
- Open recent - \`ctrl+shift+o\`
- Save file - \`ctrl+s\`
- Save as - \`ctrl+shift+s\`
- New file - \`ctrl+n\`
- Toggle preview - \`ctrl+e\`
- Bold - \`ctrl+b\`
- Italic - \`ctrl+i\`
- Link - \`ctrl+k\`
`;

export const changelog =
`# Elementary v1.1.0-alpha

Hi there! Since Elementary was first released, just about a week ago, I've gotten a lot of feedback from you. It is really great to feel the community's support for this little project of mine :D

I've implemented some of the changes that were suggested. They may have introduced unnoticed bugs. I'm releasing this alpha version in the hope that you'll be able (and willing) to report a few of them back to me. See the final section for information on how to do that.

The main change is the implementation of a preview mode. You can toggle it using the binoculars icon on the sidebar or the new \`ctrl+e\` shortcut. This feature, due to its complexity, is also the most problematic. I've tried to make it as robust as possible, but some bugs must still be around.

Here are some of the other improvements:

- New sidebar for markdown elements (can be hidden in the settings)
- Support for strikethrough and highlight (highlight isn't supported in preview mode yet)
- New shortcuts for bold (\`ctrl+b\`), italic (\`ctrl+i\`) and links (\`ctrl+k\`)
- Word and character count information
- Optional line numbers - activate on settings
- Markdown is now rendered inside quotes. Quotes got more robust overall.
- Bug fixes, of course. Especially a bug that made selecting text difficult, caused by the hacky quote implementation I had in place.

What's coming up in the future? I have a crude implementation of a PDF exporter. I'd like to polish that and publish an update later this summer. There are also plans for a spellchecker, but that will require some time.

Happy writing!

bogosorter



## Acknowledgements

Samej Spenser deserves a special thank you. It's wonderful to have people from the other side of the globe willing to provide such a structured and thoughtful advice.

I'd also like to thank all of the other people who asked for new features in Elementary. I've felt, in previous projects of mine, a barrier of communication between me and the project's users. Elementary has so far been different. Please, keep it up!



## Get in touch

I'd love to hear from you! These are a few useful links:

- [Open an issue](https://github.com/bogosorter/elementary/issues) on GitHub or send an email to \`luiswbarbosa@gmail.com\`.
- Elementary's [source code](https://github.com/bogosorter/elementary) might also be useful.
- A bit of auto-promotion here, but I can't help myself: I'm too proud of [bogothoughts](https://bogosorter.github.io/blog/) not to share it here :)
`;
