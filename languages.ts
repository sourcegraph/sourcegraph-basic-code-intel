import { HandlerArgs, CommentStyle } from './package/lib/handler'

export type LanguageSpec = { handlerArgs: HandlerArgs; stylized: string }

const cStyle: CommentStyle = {
    lineRegex: /\/\/\s*(.*)/,
    block: {
        startRegex: /\/\*\*?/,
        contentRegex: /^\s*\*?\s*(.*)/,
        endRegex: /\*\//,
    },
}

const shellStyle: CommentStyle = {
    lineRegex: /#\s*(.*)/,
}

const pythonStyle: CommentStyle = {
    docPlacement: 'below the definition',
    lineRegex: /#\s*(.*)/,
    block: {
        startRegex: /"""/,
        contentRegex: /^\s*(.*)/,
        endRegex: /"""/,
    },
}

const lispStyle: CommentStyle = {
    docPlacement: 'below the definition',
    block: {
        startRegex: /"/,
        contentRegex: /^\s*(.*)/,
        endRegex: /"/,
    },
}

// The set of languages come from https://madnight.github.io/githut/#/pull_requests/2018/4
// The language names come from https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers
// The extensions come from shared/src/languages.ts
export const languages: { [name: string]: LanguageSpec } = {
    java: {
        handlerArgs: {
            fileExts: ['java'],
            docstringIgnore: /^\s*@/,
            commentStyle: cStyle,
        },
        stylized: 'Java',
    },
    cpp: {
        handlerArgs: {
            fileExts: ['c', 'cc', 'cpp', 'hh', 'h'],
            commentStyle: cStyle,
        },
        stylized: 'C++',
    },
    ruby: {
        handlerArgs: {
            fileExts: [
                'rb',
                'builder',
                'eye',
                'fcgi',
                'gemspec',
                'god',
                'jbuilder',
                'mspec',
                'pluginspec',
                'podspec',
                'rabl',
                'rake',
                'rbuild',
                'rbw',
                'rbx',
                'ru',
                'ruby',
                'spec',
                'thor',
                'watchr',
            ],
            commentStyle: shellStyle,
        },
        stylized: 'Ruby',
    },
    php: {
        handlerArgs: {
            fileExts: [
                'php',
                'phtml',
                'php3',
                'php4',
                'php5',
                'php6',
                'php7',
                'phps',
            ],
            commentStyle: cStyle,
        },
        stylized: 'PHP',
    },
    csharp: {
        handlerArgs: {
            fileExts: ['cs', 'csx'],
            commentStyle: { ...cStyle, lineRegex: /\/\/\/?\s*(.*)/ },
        },
        stylized: 'C#',
    },
    shell: {
        handlerArgs: {
            fileExts: ['sh', 'bash', 'zsh'],
            commentStyle: shellStyle,
        },
        stylized: 'Shell',
    },
    scala: {
        handlerArgs: {
            fileExts: ['sbt', 'sc', 'scala'],
            definitionPatterns: ['\\b(def|val|var|class|object|trait)\\s%s\\b'],
            commentStyle: cStyle,
        },
        stylized: 'Scala',
    },
    swift: {
        handlerArgs: {
            fileExts: ['swift'],
            definitionPatterns: [
                '\\b(func|class|var|let|for|struct|enum|protocol)\\s%s\\b',
                '\\bfunc\\s.*\\s%s:',
            ],
            commentStyle: cStyle,
        },
        stylized: 'Swift',
    },
    rust: {
        handlerArgs: {
            fileExts: ['rs', 'rs.in'],
            commentStyle: { ...cStyle, lineRegex: /\/\/\/?!?\s*(.*)/ },
        },
        stylized: 'Rust',
    },
    kotlin: {
        handlerArgs: {
            fileExts: ['kt', 'ktm', 'kts'],
            definitionPatterns: [
                '\\b(fun|val|var|class|interface)\\s%s\\b',
                '\\bfun\\s.*\\s%s:',
                '\\bfor\\s\\(%s\\sin',
            ],
            commentStyle: cStyle,
        },
        stylized: 'Kotlin',
    },
    elixir: {
        handlerArgs: {
            fileExts: ['ex', 'exs'],
            docstringIgnore: /^\s*@/,
            definitionPatterns: ['\\b(def|defp|defmodule)\\s%s\\b'],
            commentStyle: {
                ...pythonStyle,
                docPlacement: 'above the definition',
            },
        },
        stylized: 'Elixir',
    },
    perl: {
        handlerArgs: {
            fileExts: [
                'pl',
                'al',
                'cgi',
                'fcgi',
                'perl',
                'ph',
                'plx',
                'pm',
                'pod',
                'psgi',
                't',
            ],
            commentStyle: { lineRegex: /#\s*(.*)/ },
        },
        stylized: 'Perl',
    },
    lua: {
        handlerArgs: {
            fileExts: ['lua', 'fcgi', 'nse', 'pd_lua', 'rbxs', 'wlua'],
            commentStyle: {
                lineRegex: /---?\s+(.*)/,
                block: {
                    startRegex: /--\[\[/,
                    contentRegex: /^\s*(.*)/,
                    endRegex: /\]\]/,
                },
            },
        },
        stylized: 'Lua',
    },
    clojure: {
        handlerArgs: {
            fileExts: ['clj', 'cljs', 'cljx'],
            commentStyle: lispStyle,
        },
        stylized: 'Clojure',
    },
    haskell: {
        handlerArgs: {
            fileExts: ['hs', 'hsc'],
            definitionPatterns: [
                '\\b%s\\s::',
                '^data\\s%s\\b',
                '^newtype\\s%s\\b',
                '^type\\s%s\\b',
                '^class.*\\b%s\\b',
            ],
            docstringIgnore: /INLINE|^#/,
            commentStyle: {
                lineRegex: /--[\s|]*(.*)/,
                block: {
                    startRegex: /{-/,
                    contentRegex: /^\s*(.*)/,
                    endRegex: /-}/,
                },
            },
        },
        stylized: 'Haskell',
    },
    powershell: {
        handlerArgs: {
            fileExts: ['ps1', 'psd1', 'psm1'],
            definitionPatterns: ['^function\\s%s\\b'],
            docstringIgnore: /\{/,
            commentStyle: {
                docPlacement: 'below the definition',
                block: {
                    startRegex: /<#/,
                    contentRegex: /^\s*(.*)/,
                    endRegex: /#>/,
                },
            },
        },
        stylized: 'PowerShell',
    },
    lisp: {
        handlerArgs: {
            fileExts: [
                'lisp',
                'asd',
                'cl',
                'lsp',
                'l',
                'ny',
                'podsl',
                'sexp',
                'el',
            ],
            commentStyle: lispStyle,
        },
        stylized: 'Lisp',
    },
    erlang: {
        handlerArgs: {
            fileExts: ['erl'],
            docstringIgnore: /-spec/,
            commentStyle: {
                lineRegex: /%%\s*(.*)/,
            },
        },
        stylized: 'Erlang',
    },
    dart: {
        handlerArgs: {
            fileExts: ['dart'],
            definitionPatterns: ['^(abstract\\s)?class\\s%s\\b'],
            commentStyle: { lineRegex: /\/\/\/\s*(.*)/ },
        },
        stylized: 'Dart',
    },
    ocaml: {
        handlerArgs: {
            fileExts: [
                'ml',
                'eliom',
                'eliomi',
                'ml4',
                'mli',
                'mll',
                'mly',
                're',
            ],
            commentStyle: {
                block: {
                    startRegex: /\(\*\*?/,
                    contentRegex: /^\s*\*?\s*(.*)/,
                    endRegex: /\*\)/,
                },
            },
        },
        stylized: 'OCaml',
    },
    r: {
        handlerArgs: {
            fileExts: ['r', 'R', 'rd', 'rsx'],
            commentStyle: { lineRegex: /#'?\s*(.*)/ },
        },
        stylized: 'R',
    },
}