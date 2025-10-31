# Spellchecking Guide

The `spellchecking` setting lets you choose which language to spellcheck (if at all). The only installed dictionary is `en_US`. This document guides you through the installation of other languages.

Elementary uses [Hunspell](https://hunspell.github.io/) for spellchecking. For each language, such as **pt_PT**, Elementary requires two files: `pt_PT.dic` and `pt_PT.aff`. To add a custom language, you have to get those files first. While you can use other sources, I use [this one](https://github.com/wooorm/dictionaries/tree/main/dictionaries). You'll find, in each language folder, an `index.dic` and an `index.aff`. You should download those files and rename them to match the language ID you want to use in Elementary (for example `pt_PT.dic` and `pt_PT.aff`).

Elementary looks for dictionary files in a specific place, the user data directory:

- On Linux, store your files under `~/.config/elementary/dictionaries`
- On Windows, store your files under `C:\Users\<username>\AppData\Roaming\elementary\dictionaries`