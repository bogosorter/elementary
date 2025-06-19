# PDF Export Guide

- [Pandoc](#pandoc)
- [Additional Tips](#additional-tips)  
- [Export Errors](#export-errors)  

## Pandoc

Elementary relies on [Pandoc](https://pandoc.org/) to convert markdown files into PDF. To use PDF export, you must have Pandoc installed. Install it via your package manager or from the [Pandoc website](https://pandoc.org/installing.html).

## Additional Tips

**Including CSS**

Markdown is simple but limited for styling. You can include CSS to customize your document. Link an external CSS file inside your markdown with:

```html
<link rel="stylesheet" href="./path/to/file.css">
```

Or embed CSS directly:

```html
<style>
  p {
    font-style: italic;
  }
</style>
```

**Page Breaks**

Sometimes content breaks awkwardly in the PDF. You can force a page break with:

```html
<div style="page-break-after: always;"></div>
```

## Export Errors

If Elementary shows an error during export, try running it from the terminal to see detailed messages. If the problem continues, please [file an issue](https://github.com/bogosorter/elementary/issues).
