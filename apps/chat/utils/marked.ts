import {marked} from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs.css'

const markedOptions = {
    renderer: new marked.Renderer(),
    highlight: function (code: string, language: string) {
        const validLanguage = hljs.getLanguage(language) ? language : ''
        const highlightedCode = hljs.highlightAuto(code).value
        return `<pre><div class='bg-white rounded-md mb-4'><div class='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md'><span>${validLanguage}</span><button onclick="copy(this)" class="flex items-center ml-auto gap-2 bg-transparent border-0 cursor-pointer outline-none"><svg focusable="false" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg><span>复制代码</span><code style="display:none">${highlightedCode}</code></button></div><div class='p-4 overflow-y-auto border-2 border-solid border-gray-800 rounded-b-md'><code class="!whitespace-pre hljs language-${validLanguage}">${highlightedCode}</code></div></div></pre>`;
    },
    pedantic: false,
    langPrefix: 'hljs language-',
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
}
marked.setOptions(markedOptions)
