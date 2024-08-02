export const info = `

# Elementary

Elementary is a simple markdown editor built by [bogosorter](https://bogosorter.github.io).



## Getting started

If you're in a hurry, start typing right away: Elementary is fairly intuitive.

For more info on the markdown elements and Elementary shortcuts, check the command palette using the settings icon to your left or \`ctrl+p\`. If you'd like to know a little more about how Elementary came to be, read on!



## Background

I loved Typora's editing experience, but it has since become a paid app... On the lookout for an alternative, I used Marktext - an open-source app - for a while, but it proved itself to be somewhat buggy. After many more frustrated attempts, I turned to VS Code. Though not aesthetically pleasing, VS Code was reliable and met my needs.

Then, I learnt that VS Code's core editor, Monaco, was open-source. That's when the idea of adapting Monaco to fit my needs came to be. The core of Elementary is based on Monaco and should provide a reliable and bug-free experience. I did, however, change all of the editor's styles for aesthetic's sake, and built the logic that makes this a standalone app. Elementary uses electron and react, put together by the electron-react-boilerplate.

Currently, I have yet to implement a spell-checker, which I hope to tackle soon, and markdown inside quotes' rendering. I will try to deal with the latter as soon as I'm in the mood to be frustrated :)

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

Happy writing!

`;

export const markdown = `
# Markdown syntax

Elementary supports all standard markdown elements. Here's a quick refresher:

- **Bold** text is surrounded with two \`*\` or two \`_\`
- *Italic* text is surrounded with one \`*\` or one \`_\`
- List items start with a single \`-\`
- Quotes start with a \`>\`
- Inline code is surrounded with a backtick
- Links are formated like [this](https://example.com)
- Headings use a variable number of hashtags: \`##\` is a level two heading and \`###\` is a level 3 heading.

For further syntax elements check [this guide](https://www.markdownguide.org/cheat-sheet/).
`;

export const shortcuts = `
# Shortcuts

Elementary defines the following shortcuts:

- Command palette - \`ctrl+p\`, \`ctrl+shift+p\`, \`ctrl+k\` or \`esc\`
- Open file - \`ctrl+o\`
- Open recent - \`ctrl+shift+o\`
- Save file - \`ctrl+s\`
- Save as - \`ctrl+shift+s\`
- New file - \`ctrl+n\`
`;
