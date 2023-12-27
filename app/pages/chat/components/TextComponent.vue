<template>
  <div v-if="!asRawText" ref="textRef" class="markdown prose w-full common-table" v-html="newText"></div>
  <div v-else
       class="flex w-full flex-col gap-4 whitespace-pre-wrap break-words shrink-0 grow-0 basis-11/12 common-table"
       v-html="newText"></div>
</template>
<script setup>
import {computed, onMounted, onUnmounted, onUpdated, ref} from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/vs.css'
import {copyText} from '~/utils/copy'
import {message as Notify} from 'ant-design-vue'

const mdi = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, {language: lang}).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})
mdi.use(mila, {attrs: {target: '_blank', rel: 'noopener'}})
mdi.use(mdKatex, {blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000'})
const props = defineProps({
  text: {
    type: String,
    default: '',
    required: false
  },
  asRawText: {
    type: Boolean,
    default: false,
    required: false
  }
})

const newText = computed(() => {
  const value = props.text ?? ''
  if (!props.asRawText) {
    return mdi.render(value)
  }
  return value
})

function highlightBlock(str, lang = '') {
  return `<pre><div class='bg-white rounded-md mb-4'><div class='flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md'><span>${lang}</span><button class="flex items-center ml-auto gap-2 bg-transparent border-0 cursor-pointer outline-none code__copy"><svg focusable="false" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg><span>复制代码</span></button></div><div class='p-4 overflow-y-auto border-2 border-solid border-gray-800 rounded-b-md'><code class="!whitespace-pre hljs language-${lang}">${str}</code></div></div></pre>`
}

const textRef = ref(null)

function addCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code__copy')
    copyBtn.forEach((btn) => {
      btn.addEventListener('click', function () {
        const code = this.parentElement?.nextElementSibling?.textContent
        if (code) {
          const result = copyText(code)
          Notify?.destroy()
          if (result) {
            Notify.success('复制成功！')
          } else {
            Notify.error('复制失败')
          }
        }
      })
    })
  }
}

function removeCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.removeEventListener('click', () => {
      })
    })
  }
}

onMounted(() => {
  addCopyEvents()
})

onUpdated(() => {
  addCopyEvents()
})

onUnmounted(() => {
  removeCopyEvents()
})
</script>
<style lang="less">
.common-table {
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
  }

  th,
  td {
    padding: 6px;
    text-align: center;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
}
</style>
