# HTMLToMD

HTML to MD simple converter tool

## Features

- One javascript file
- Capable to run from your local disk
- No modules or any backend/framework needed
- around 7 kB (not minified)
- Supports base of standard output from [Marked][Marked] and [Prism][Prism]
- Part of bigger [project][HV] that has been refactored to be independent

## Demo

1. [Demo implementation][Demo] is a single HTML file to show you needed configuration to make it work.

    1. Scroll down and click **Convert to TeX** button 
    2. Result will be shown in textarea under the button
    3. **Copy** button doesn't have any function and it is kept exactly as it is being produced by Prism library (manually copied here to demonstrate how does this case works)

2. **HelpViewer integration** source code: [export handler][HVINT] and [pre export preparation for image links collection][HVINT2]. This code is executed when you will click on top right dropdown button (📥) and select **MD** format.

## Installation

Add reference to head section:
```html
<script src="https://raw.githubusercontent.com/HelpViewer/HTMLToMD/refs/heads/main/HTMLToMD.js" type="text/javascript"></script>
```

or copy this file to your local environment.

## API

Call **HTMLToMD** function with  
parameters:
- parent - HTMLElement which contains all your HTML data which should be converted to TeX
- ctx - internal state context for single run (provide: { listStack: [], i_img: 0, i_svg: 0, embeds: new Map() } as default)
  - listStack - ul/ol nesting sequence
  - i_img - img tags found counter
  - i_svg - svg tags found counter
  - embeds - previously collected embedded objects (img, svg)

to get result :
markdown source code.

## Known limits and issues

- Tool focuses on using only the basic scenarios of format (possibly nesting objects and combinations in table can be incorrect)
- Text formatting functions are used only to a basic extent (despite your HTML can be more rich in format)
- Nested code listings are exported wrong (4 and 3 backticks blocks are exported as 3 and 3)

## Version publishing

- No managed packages or artifacts are planned to be released from this repository
- Work directly with the content of the main branch of the GitHub repository
- Repository is used with Git submodules in **HelpViewer** project

[Marked]: https://marked.js.org/ "Marked JavaScript library - md files to HTML renderer"
[Prism]: https://prismjs.com/ "Prism - syntax highlighting"
[HV]: https://github.com/HelpViewer/HelpViewer "HelpViewer"
[Demo]: https://github.com/HelpViewer/HTMLToMD/blob/main/.extras/index.html "Demo"
[HVINT]: https://github.com/HelpViewer/HelpViewer/blob/master/zip/plugins/pExportMD.js "Export handler"
[HVINT2]: https://github.com/HelpViewer/HelpViewer/blob/master/zip/plugins/puiButtonExport.js#L41 "Export : image links collection"
