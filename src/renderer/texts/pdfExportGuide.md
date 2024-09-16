# PDF export guide

- [Export configuration](#export-configuration)
- [Including CSS](#including-css)
- [Additional tips](#additional-tips)



## Export configuration

Elementary's PDF exporter will work out of the box, but you'll likely want to configure it a little further. PDF configuration is done through some metadata at the top of the document in [YAML](https://en.wikipedia.org/wiki/YAML).

To start a YAML block, insert this at the top of your document:

```txt
---
# Content goes here
---
```

These are the available options:

```yaml
---

document_title: Title

# There are four ways to add CSS to the document:
#   - Inline CSS in the initial YAML (will only be rendered on exporting)
#   - CSS files in initial YAML (will only be rendered on exporting)
#   - Inline CSS using the <style> tag (see below)
#   - CSS files included using the <link> tag (see below)

# Inline CSS in the initial YAML
css: "
  # Some CSS variables defined for Elementary's theme that you might like to
  # change
  :root {
      --font-size: 12px !important;
      --text-align: justify !important;
      --primary: "#3c3c3c" !important; # color used in text
      --accent: "#286c93" !important; # colors used in headings, links, etc.
  }

  # Other CSS is also valid
  p {
      font-style: italic;
  }
"

# CSS files in initial YAML
# Please make sure to use the **absolute** path
stylesheet:
  - /home/bogosorter/styles.css
  - etc.

# These classes are added to the <body> tag of the generated html and are useful
# to define various themes. By the default the `elementary` theme is used.
body_class:
  - elementary

pdf_options:

  landscape: true
  format: A6
  margin:
    top: 10mm # px, mm, cm and in are all alowed
    bottom: 10mm
    left: 10mm
    right: 10mm

  # You can customize a header and a footer for your exported pdf using html.
  # Some special variables are provided: `date`, `title`, `pageNumber`, and
  # `totalPages`.
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

You can embed CSS either into the initial metadata, as shown above, or into the body of your markdown file. Please note, though, that CSS included into the body will be rendered int both preview mode and the exported PDF, whereas CSS included in the YAML section will only be rendered in the exported PDF.

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