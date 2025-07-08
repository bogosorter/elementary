export const info =
`# Elementary

Elementary is a simple markdown editor built by [bogosorter](https://bogosorter.github.io).



## Getting started

If you're in a hurry, start typing right away: Elementary is fairly intuitive.

For more info on the markdown elements and Elementary shortcuts, check the command palette using the settings icon to your left or \`ctrl+p\`. If you'd like to know a little more about how Elementary came to be, read on!



## Background

I loved Typora's editing experience, but it has since become a paid app... On the lookout for an alternative, I used Marktext - an open-source app - for a while, but it proved itself to be somewhat buggy. After many more frustrated attempts, I turned to VS Code. Though not aesthetically pleasing, VS Code was reliable and met my needs.

Then, I learnt that VS Code's core editor, Monaco, was open-source. That's when the idea of adapting Monaco to fit my needs came to be. The core of Elementary is based on Monaco and should provide a reliable and bug-free experience. I did, however, change all of the editor's styles for aesthetic's sake, and built the logic that makes this a standalone app. Elementary uses electron and react, put together by the electron-react-boilerplate.

I hope you enjoy Elementary!

bogosorter

P.S.: Those quotes took a really long time to implement, you should check them out!

P.P.S.: If you got this far, you deserve a treat. I am a huge fan of clean interfaces and, since you're using Elementary, I'm guessing you are too. You can use the command palette to set the interface complexity to Minimal, as I do. Beware: you mustn't forget the shortcut to open the command palette since that's where the app's logic resides.



## Acknowledgements

I must thank [comma](https://github.com/useyourcommas) for her precious help. She reviewed almost every detail in the app, patiently heard my chatter about it and designed Elementary's logo. Elementary would be a different app without her.

Samej Spenser also deserves a special thank you. It's wonderful to have people from the other side of the globe willing to provide such a structured and thoughtful advice.



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
- Uppercase - \`ctrl+u\`
- Lowercase - \`ctrl+l\`
- Duplicate line - \`ctrl+d\`
`;

export const changelog =
`# Elementary v1.2.0

Hi again!

The main highlight of this release is the new PDF exporter. To export a file, use the button on the sidebar or the command palette. For configuration details, open the command palette and search for "PDF Export Guide." Here’s what else has changed:

- New shortcuts for uppercase (\`ctrl+u\`), lowercase (\`ctrl+l\`) and duplicate line (\`ctrl+d\`)
- Improved file identification in "Open Recent"
- Added an error message when opening a recent file that no longer exists
- Shortened path display for the current file on small screens
- New setting to receive notifications about future pre-releases

What's coming next? I'm planning to add a spellchecker, though it may take some time. Other new features will depend, quite literally, on you! Most of the changes in this version came from suggestions made by users, and I'd love to hear from you.

Happy writing!

bogosorter



## Acknowledgements

Samej Spenser deserves a special thank you. It's wonderful to have people from the other side of the globe willing to provide such a structured and thoughtful advice.

I'd also like to thank all of the other people who asked for new features in Elementary. I've felt, in previous projects of mine, a barrier of communication between me and the project's users. Elementary has so far been different. Please, keep it up!



## Get in touch

I'd love to hear from you. These are a few useful links:

- [Open an issue](https://github.com/bogosorter/elementary/issues) on GitHub or send an email to \`luiswbarbosa@gmail.com\`.
- Elementary's [source code](https://github.com/bogosorter/elementary) might also be useful.
`;

export const pdfExportGuide = `
# PDF Export Guide

## Including CSS

Markdown is simple but limited for styling. You can include CSS to customize your document. Link an external CSS file inside your markdown with:

\`\`\`html
<link rel="stylesheet" href="./path/to/file.css">
\`\`\`

Or embed CSS directly:

\`\`\`html
<style>
  p {
    font-style: italic;
  }
</style>
\`\`\`

## Page Breaks

Sometimes content breaks awkwardly in the PDF. You can force a page break with:

\`\`\`html
<div style="page-break-after: always;"></div>
\`\`\`

## Export Errors

If Elementary shows an error during export, try running it from the terminal to see detailed messages. If the problem continues, please [file an issue](https://github.com/bogosorter/elementary/issues).

`;
