const exportCSS = `
:root {
    --primary: #3c3c3c;
    --accent: #286c93;
    --font-size: 12px;
    --text-align: justify;
}

* {
    overflow-wrap: anywhere;
    scroll-margin-top: 100px;
    font-size: var(--font-size);
    text-align: var(--text-align);
    color: var(--primary);
    font-family: "Droid Sans Mono", "monospace", monospace;
}

::selection {
    background-color: var(--selection);
    color: var(--primary);
}

h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
}

h1 {
    color: var(--accent);
    font-size: calc(var(--font-size) * 1.8);
    margin-top: 100px;
    margin-bottom: 24px;
}
h2 {
    color: var(--accent);
    font-size: calc(var(--font-size) * 1.6);
    margin-top: 100px;
    margin-bottom: 20px;
}
h3 {
    font-size: calc(var(--font-size) * 1.4);
    margin-top: 60px;
    margin-bottom: 16px;
}
h4 {
    font-size: calc(var(--font-size) * 1.2);
    margin-top: 45px;
    margin-bottom: 12px;
}
h5 {
    font-size: calc(var(--font-size) * 1.2);
    margin-top: 35px;
    margin-bottom: 12px;
}
h6 {
    font-size: calc(var(--font-size) * 1.1);
    margin-top: 20px;
    margin-bottom: 12px;
}

code:not(pre code) {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    padding: 0 5px;
    font-size: var(--font-size);
    border: none;
}

pre code, pre code.hljs {
    font-size: var(--font-size);
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--primary);
    border: none;
}

a {
    color: var(--accent);
    text-decoration: none;
    font-weight: bold;
    outline: none;
}

blockquote {
    border-left: 5px solid var(--accent);
    padding: 0 10px;
    margin-left: 0;
    margin-right: 0;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    font-style: normal;

    /* A little trick that'll force the content's margins to be kept withing the
    blockquote */
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
}

hr {
    border: none;
    border-top: 2px solid var(--accent);
}

img {
    max-width: 100%;
}
`;

export default exportCSS;
