
import { ui } from './ui'
const FILE_NAMES = ['model.json', 'metadata.json', 'weights.bin']
export const upload = {
  fileListDom: document.querySelector('#fileList'),
  fileList: [],
  messages: {
    completion: '感谢您的合作，您已经上传了足够的文件。现在，您可以继续点击提交按钮，以完成操作。',
    duplicateUpload: '感谢您的上传，该文件已经上传过，请不要重复上传。',
    fileIssue: '非常抱歉，我们注意到您上传的文件可能有一些问题，可能不符合我们的要求。<br />为了确保您的体验和结果能够如期进行，请您重新上传正确的文件。',
    uploadPrompt: '请注意，您上传的模型文件示例不足，必须包含​（上、下、左、右）​这四个示例。为了满足您的需求，我们需要您提供这些示例。'
  },
  remove(filename) {
    const index = this.fileList.findIndex(item => item.name === filename)
    this.fileList.splice(index, 1)
    this.renderFileListHtml()
  },
  addRemoveEvent () {
    this.fileListDom.addEventListener('click', (e) => {
      const target = e.target
      if (target.tagName === 'BUTTON') {
        this.remove(target.dataset.name)
      }
    })
  },
  async validate(files) {
    if (this.fileList.length === FILE_NAMES.length) {
      return this.messages.completion
    }
    let msg = ''
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const isFileInArray = this.fileList.some(f => f.name === file.name);
      if (isFileInArray) {
        msg = this.messages.duplicateUpload
        break
      }
      if (FILE_NAMES.includes(file.name)) {
        this.fileList = [...(this.fileList || []), file]
      } else {
        msg = this.messages.fileIssue
        break
      }
    }
    this.renderFileListHtml()
    if (this.fileList.length > 0) {
      document.querySelector('#files').style.display = 'block'
    }
    return msg
  },
  renderFileListHtml() {
    let html = ''
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (FILE_NAMES.includes(file.name)) {
        html += `<li class='flex items-center py-1 border border-solid border-gray-400 p-2 mb-1 rounded-md'><span class='text-lg font-bold'>${file.name}</span><button type='button' class='ml-auto bg-red-500 px-3 py-1 text-sm leading-5 rounded-full font-semibold text-white border-0 cursor-pointer' data-name='${file.name}'>删除</button></li>`
      }
    }
    this.fileListDom.innerHTML = html
    if (this.fileList.length === FILE_NAMES.length) {
      document.querySelector('#uploadModel').setAttribute('disabled', true)
    } else {
      document.querySelector('#uploadModel').removeAttribute('disabled')
    }
  },
  async change(e, callback = () => {}) {
    let files
    if (e.type === 'drop') {
      files = e.dataTransfer.files
    } else {
      files = e.target.files
    }
    const msg = await this.validate(files)
    document.querySelector('#uploadModel').value = ''
    if (msg) {
      ui.showToast(msg)
      return
    }
    if (typeof callback === 'function') {
      callback()
    }
  },
  submit() {
    const data = new FormData();
    for (const file of this.fileList) {
      data.append(file.name, file);
    }
    ui.showLoading('模型上传中…')
    return new Promise((resolve, reject) => {
      fetch('/api/oss/train/upload', {
        method: 'POST',
        body: data,
      }).then((response) => {
        ui.hideLoading()
        // 注意此处
        response.json().then((data) => {
          if (data.code === 0) {
            resolve(data.data)
          } else {
            resolve(null)
          }
        }).catch((err) => {
          alert(err)
          resolve(null)
        })
      });
    })
  }
}
upload.addRemoveEvent()
function arraysHaveSameContent(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false; // 如果数组长度不相等，直接返回 false
  }
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  for (const item of set1) {
    if (!set2.has(item)) {
      return false; // 如果在一个集合中找不到相同元素，返回 false
    }
  }

  return true; // 如果两个集合中的元素相同，返回 true
}