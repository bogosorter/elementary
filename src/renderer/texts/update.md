# Elementary v1.1.0-alpha

Hi there! Since Elementary was first released, just about a week ago, I've gotten a lot of feedback from you. It is really great to feel the community's support for this little project of mine :D

I've implemented some of the changes that were suggested. They may have introduced unnoticed bugs. I'm releasing this alpha version in the hope that you'll be able (and willing) to report a few of them back to me. See the final section for information on how to do that.

The main change is the implementation of a preview mode. You can toggle it using the binoculars icon on the sidebar or the new `ctrl+e` shortcut. This feature, due to its complexity, is also the most problematic. I've tried to make it as robust as possible, but some bugs must still be around.

Here are some of the other improvements:

- New sidebar for markdown elements (can be hidden in the settings)
- Support for strikethrough and highlight (highlight isn't supported in preview mode yet)
- New shortcuts for bold (`ctrl+b`), italic (`ctrl+i`) and links (`ctrl+k`)
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

- [Open an issue](https://github.com/bogosorter/elementary/issues) on GitHub or send an email to `luiswbarbosa@gmail.com`.
- Elementary's [source code](https://github.com/bogosorter/elementary) might also be useful.
- A bit of auto-promotion here, but I can't help myself: I'm too proud of [bogothoughts](https://bogosorter.github.io/blog/) not to share it here :)