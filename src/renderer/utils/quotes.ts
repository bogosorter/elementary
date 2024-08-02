// Check for quotes and tag them with data attributes
export default function tagQuotes(ids: string[]) {
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

    let quoteStarted = false;
    let previousLine: HTMLElement | null = null;
    for (const line of lines) {

        // Clean up previous tags
        line.dataset.quote = 'false';
        line.dataset.quoteStart = 'false';
        line.dataset.quoteEnd = 'false';

        if (!(checkForClass(line, ids[0]) || checkForClass(line, ids[1]))) {
            if (quoteStarted && previousLine) {
                previousLine.dataset.quoteEnd = 'true';
            }
            quoteStarted = false;
            continue;
        }

        line.dataset.quote = 'true';
        if (!quoteStarted) {
            quoteStarted = true;
            line.dataset.quoteStart = 'true';
        }

        previousLine = line;
    }

    if (quoteStarted) {
        previousLine!.dataset.quoteEnd = 'true';
    }
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
