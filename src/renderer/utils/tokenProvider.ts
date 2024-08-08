import { languages } from 'monaco-editor';

// This code is mostly from https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/markdown/markdown.ts

export const configuration: languages.LanguageConfiguration = {
	comments: {
		blockComment: ['<!--', '-->']
	},
	brackets: [],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
        { open: '*', close: '*', notIn: ['string', 'code'] },
        { open: '_', close: '_', notIn: ['string', 'code'] },
		{ open: '<', close: '>', notIn: ['string', 'code'] },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
	],
	surroundingPairs: [
		{ open: '(', close: ')' },
		{ open: '[', close: ']' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '*', close: '*' },
        { open: '_', close: '_' },
	],
	folding: {
		markers: {
			start: new RegExp('^\\s*<!--\\s*#?region\\b.*-->'),
			end: new RegExp('^\\s*<!--\\s*#?endregion\\b.*-->')
		}
	}
};

export const tokenProvider: languages.IMonarchLanguage = {
	defaultToken: '',
	tokenPostfix: '.md',

	// escape codes
	control: /[\\`*_\[\]{}()#+\-\.!]/,
	noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
	escapes: /\\(?:@control)/,

	// escape codes for javascript/CSS strings
	jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

	// non matched elements
	empty: [
		'area',
		'base',
		'basefont',
		'br',
		'col',
		'frame',
		'hr',
		'img',
		'input',
		'isindex',
		'link',
		'meta',
		'param'
	],

	tokenizer: {
		root: [
			// markdown tables
			[/^\s*\|/, '@rematch', '@table_header'],

			// headings
            // h1
            [/^(\s{0,3})(#)((?:[^\\#]|@escapes)+)((?:\2)?)/, ['white', 'heading1', 'heading1', 'heading1']],
            [/^\s*(=+)\s*$/, 'heading1'],
            // h2
            [/^(\s{0,3})(##)((?:[^\\#]|@escapes)+)((?:\2)?)/, ['white', 'heading2', 'heading2', 'heading2']],
            [/^\s*(\-+)\s*$/, 'heading2'],
            // h3
            [/^(\s{0,3})(###)((?:[^\\#]|@escapes)+)((?:\2)?)/, ['white', 'heading3', 'heading3', 'heading3']],
            // h4
            [/^(\s{0,3})(####)((?:[^\\#]|@escapes)+)((?:\2)?)/, ['white', 'heading4', 'heading4', 'heading4']],
            // h5
            [/^(\s{0,3})(#####)((?:[^\\#]|@escapes)+)((?:\2)?)/, ['white', 'heading5', 'heading5', 'heading5']],
            // h6
            [/^(\s{0,3})(######)((?:[^\\#]|@escapes)+)((?:\2)?)/, ['white', 'heading6', 'heading6', 'heading6']],

			// quote
			[/^(\s*)(>+)(\s+)(.*)/, ['white', 'quote', 'white', 'quote-text']],

			// list (starting with * or number)
			[/^\s*([\*\-+:]|\d+\.)\s/, 'list'],

			// code block (4 spaces indent)
			[/^(\t|[ ]{4})[^ ].*$/, 'code'],

			// code block (3 tilde)
			[/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, { token: 'string', next: '@codeblock' }],

			// github style code blocks (with backticks and language)
			[
				/^\s*```\s*((?:\w|[\/\-#])+).*$/,
				{ token: 'code', next: '@codeblockgh', nextEmbedded: '$1' }
			],

			// github style code blocks (with backticks but no language)
			[/^\s*```\s*$/, { token: 'code', next: '@codeblock' }],

			// markup within lines
			{ include: '@linecontent' }
		],

		table_header: [
			{ include: '@table_common' },
			[/[^\|]+/, 'keyword.table.header'] // table header
		],

		table_body: [{ include: '@table_common' }, { include: '@linecontent' }],

		table_common: [
			[/\s*[\-:]+\s*/, { token: 'keyword', switchTo: 'table_body' }], // header-divider
			[/^\s*\|/, 'keyword.table.left'], // opening |
			[/^\s*[^\|]/, '@rematch', '@pop'], // exiting
			[/^\s*$/, '@rematch', '@pop'], // exiting
			[
				/\|/,
				{
					cases: {
						'@eos': 'keyword.table.right', // closing |
						'@default': 'keyword.table.middle' // inner |
					}
				}
			]
		],

		codeblock: [
			[/^\s*~~~\s*$/, { token: 'string', next: '@pop' }],
			[/^\s*```\s*$/, { token: 'string', next: '@pop' }],
			[/.*$/, 'variable.source']
		],

		// github style code blocks
		codeblockgh: [
			[/```\s*$/, { token: 'code', next: '@pop', nextEmbedded: '@pop' }],
			[/[^`]+/, 'variable.source']
		],

		linecontent: [
			// escapes
			[/&\w+;/, 'string.escape'],
			[/@escapes/, 'escape'],

			// various markup
			[/\b__([^\\_]|@escapes|_(?!_))+__\b/, 'strong'],
			[/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, 'strong'],
			[/\b_[^_]+_\b/, 'emphasis'],
			[/\*([^\\*]|@escapes)+\*/, 'emphasis'],
			[/`([^\\`]|@escapes)+`/, 'inline-code'],
            [/~~([^\\~]|@escapes|~(?!~))+~~/, 'strikethrough'],
            [/==([^\\=]|@escapes|=(?!=))+==/, 'highlight'],

			// links
			[/\{+[^}]+\}+/, 'string.target'],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ['string.link', '', 'string.link']],
			[/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, 'string.link'],

			// or html
			{ include: 'html' }
		],

		// Note: it is tempting to rather switch to the real HTML mode instead of building our own here
		// but currently there is a limitation in Monarch that prevents us from doing it: The opening
		// '<' would start the HTML mode, however there is no way to jump 1 character back to let the
		// HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
		// we cannot correctly tokenize it in that mode yet.
		html: [
			// html tags
			[/<(\w+)\/>/, 'tag'],
			[
				/<(\w+)(\-|\w)*/,
				{
					cases: {
						'@empty': { token: 'tag', next: '@tag.$1' },
						'@default': { token: 'tag', next: '@tag.$1' }
					}
				}
			],
			[/<\/(\w+)(\-|\w)*\s*>/, { token: 'tag' }],

			[/<!--/, 'comment', '@comment']
		],

		comment: [
			[/[^<\-]+/, 'comment.content'],
			[/-->/, 'comment', '@pop'],
			[/<!--/, 'comment.content.invalid'],
			[/[<\-]/, 'comment.content']
		],

		// Almost full HTML tag matching, complete with embedded scripts & styles
		tag: [
			[/[ \t\r\n]+/, 'white'],
			[
				/(type)(\s*=\s*)(")([^"]+)(")/,
				[
					'attribute.name.html',
					'delimiter.html',
					'string.html',
					{ token: 'string.html', switchTo: '@tag.$S2.$4' },
					'string.html'
				]
			],
			[
				/(type)(\s*=\s*)(')([^']+)(')/,
				[
					'attribute.name.html',
					'delimiter.html',
					'string.html',
					{ token: 'string.html', switchTo: '@tag.$S2.$4' },
					'string.html'
				]
			],
			[/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, ['attribute.name.html', 'delimiter.html', 'string.html']],
			[/\w+/, 'attribute.name.html'],
			[/\/>/, 'tag', '@pop'],
			[
				/>/,
				{
					cases: {
						'$S2==style': {
							token: 'tag',
							switchTo: 'embeddedStyle',
							nextEmbedded: 'text/css'
						},
						'$S2==script': {
							cases: {
								$S3: {
									token: 'tag',
									switchTo: 'embeddedScript',
									nextEmbedded: '$S3'
								},
								'@default': {
									token: 'tag',
									switchTo: 'embeddedScript',
									nextEmbedded: 'text/javascript'
								}
							}
						},
						'@default': { token: 'tag', next: '@pop' }
					}
				}
			]
		],

		embeddedStyle: [
			[/[^<]+/, ''],
			[/<\/style\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
			[/</, '']
		],

		embeddedScript: [
			[/[^<]+/, ''],
			[/<\/script\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
			[/</, '']
		]
	}
};
