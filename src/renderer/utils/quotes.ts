// Check for quotes and tag them with data attributes
export default function tagQuotes() {
    const lineContainer = document.getElementsByClassName('view-lines')[0];
    if (!lineContainer) return;

    // Monaco may render the lines out of order, so we need to sort them
    // according to their 'top' css property. If all of this feels a little too
    // hacky, well, I guess that's the consequence of using a library for
    // something it wasn't designed for :)
    const lines = [];
    for (const child of lineContainer.children) lines.push(child as HTMLElement);
    lines.sort((a, b) => {
        const aTop = parseInt(a.style.top);
        const bTop = parseInt(b.style.top);
        return aTop - bTop;
    })

    // Clean up previous borders
    const container = document.getElementById('quote-border-container')!;
    while (container.firstChild) container.removeChild(container.firstChild);

    let quoteStarted = false;
    let previousBorder: HTMLElement | null = null;

    for (const line of lines) {
        if (!checkForClass(line, 'quote')) {
            if (quoteStarted) previousBorder!.classList.add('quote-border-end');
            quoteStarted = false;
            continue;
        }

        previousBorder = createQuoteBorder(line);

        if (!quoteStarted) {
            quoteStarted = true;
            previousBorder.classList.add('quote-border-start');
        }
    }

    if (quoteStarted) {
        previousBorder!.classList.add('quote-border-end');
    }
}

function createQuoteBorder(attach: HTMLElement) {
    const border = document.createElement('div');
    border.classList.add('quote-border');
    border.style.position = 'fixed';
    border.style.top = attach.getBoundingClientRect().top + 'px';
    border.style.left = attach.getBoundingClientRect().left - 10 + 'px';
    border.style.height = attach.getBoundingClientRect().height + 'px';
    border.style.width = attach.getBoundingClientRect().width + 10 + 'px';

    const container = document.getElementById('quote-border-container')!;
    container.appendChild(border);
    return border;
}

// Recursively checks an element and its children for a class
function checkForClass(element: HTMLElement, className: string): boolean {
    if (element.classList.contains(className)) {
        return true;
    }

    for (const child of element.children) {
        if (checkForClass(child as HTMLElement, className)) {
            return true;
        }
    }

    return false;
}
