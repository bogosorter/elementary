# PDF export guide

- [Export configuration](#export-configuration)
    - [Document title](#document-title)
    - [PDF options](#pdf-options)
    - [Custom header and footer](#custom-header-and-footer)
- [Including CSS](#including-css)
- [Additional tips](#additional-tips)
- [Export errors](#export-errors)





## Export configuration

Please note that Elementary's PDF exporter will work out of the box. All of the steps described here are optional. PDF configuration is done through some metadata at the top of the document in [YAML](https://en.wikipedia.org/wiki/YAML).

To start a YAML block, insert this at the top of your document:

```markdown
---
# Content goes here
---
```


### Document title

```yaml
---
document_title: The Complete History of Bogosort
---
```

### PDF options

You may change the output file's dimensions, margins, and orientation.

```yaml
pdf_options:
  landscape: true
  format: A6
  margin:
    top: 10mm # px, mm, cm and in are all alowed
    bottom: 10mm
    left: 10mm
    right: 10mm
```

### Custom header and footer

You can customize a header and a footer for your exported pdf using html. Some special variables are provided: `date`, `title`, `pageNumber`, and `totalPages`. To use the `pageNumber`, for instance, you should have an element with the classname `pageNumber`. This might be a bit confusing - take a look at the examples:

```yaml
---
pdf_options:
  displayHeaderFooter: true
  headerTemplate: "
    <p style='font-size: 14px; text-align: center; width: 100%; font-weight: bold'>
      <span class='title'></span>
    </p>
  "
  footerTemplate: "
    <p style='font-size: 10px; text-align: center; width: 100%'>
      <span class='pageNumber'></span>/<span class='totalPages'></span>
    </p>
  "
---
```

## Including CSS

Markdown's simplicity is quite useful for text editing, but it becomes somewhat limited when you want to apply custom styles to your document. That's why markdown supports inline html and allows you to include CSS styles.

You can embed CSS either into the initial metadata or into the body of your markdown file. Please note, though, that CSS included into the body will be rendered in both preview mode and the exported PDF, whereas CSS included in the YAML section will only be rendered in the exported PDF.

Including CSS files in the YAML:

```yaml
stylesheet:
  - /home/bogosorter/styles.css
  - etc.
```

You can link to a CSS file in the body of your document:

```html
<link rel="stylesheet" href="./path/to/file.css">
```

Alternatively, you can include inline CSS like this:

```html
<style>
    p {
        font-style: italic;
    }
</style>
```


## Additional tips

**Page Breaks**

Content will sometimes break in odd places when it is exported. To prevent this, you can use some inline HTML to force a break in a more convenient place:

```html
<div style="page-break-after: always;"></div>
```

**Generated HTML**

The conversion from markdown into PDF is done in two steps:

1. Conversion from markdown into HTML
2. Conversion from HTML into a PDF

The intermediate conversion into HTML is done using [Marked](https://marked.js.org/). You might find their [demo page](https://marked.js.org/demo/) a useful tool to inspect the generated HTML. This comes in handy, for instance, to know what CSS selectors you should use.



## Export errors

If Elementary reports an error while exporting, please check your export configuration carefully - that's where most errors come from. If the error persists please [file an issue](https://github.com/bogosorter/elementary/issues).
