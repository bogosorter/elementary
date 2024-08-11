import { Node } from 'unist';
import { visit } from 'unist-util-visit';

export default function highlightPlugin() {
    const regex = /==(.*?)==/g;

    return (tree: Node) => {
      visit(tree, 'text', (node: Node) => {
        const textNode = node as any as { value: string };
        const { value } = textNode;
        if (regex.test(value)) {
          const matches = Array.from(value.matchAll(regex));
          const result: Node[] = [];
          let lastIndex = 0;

          matches.forEach((match) => {
            if (match.index !== undefined && match.index > lastIndex) {
              result.push({
                type: 'text',
                value: value.slice(lastIndex, match.index),
              });
            }
            result.push({
              type: 'highlight',
              value: match[1],
            } as HighlightNode);
            lastIndex = match.index! + match[0].length;
          });

          if (lastIndex < value.length) {
            result.push({
              type: 'text',
              value: value.slice(lastIndex),
            });
          }

          // Modify the original node to become a parent node
          (node as any).type = 'element';
          (node as any).tagName = 'span';
          (node as any).children = result;
        }
      });
    };
  };
