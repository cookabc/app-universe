const fragment = document.createDocumentFragment()
export const ui = {
    showLoading(text) {
        const loadingBox = document.createElement('div')
        loadingBox.id = 'loadingBox'
        loadingBox.classList.add('loading', 'fixed', 'inset-0', 'z-10', 'flex', 'justify-center', 'items-center', 'bg-black/25')
        const loadingInner = document.createElement('div')
        loadingInner.classList.add('loading-inner', 'flex', 'justify-center', 'items-center', 'mt-10%', 'p-6', 'text-white', 'text-xl', 'bg-black/80', 'rounded-lg', 'gap-x-3', 'max-w-[500px]')
        const loadingIcon = document.createElement('div')
        loadingIcon.classList.add('custom-loading', 'animate-spin', 'loading-icon', 'w-8', 'h-8')
        const textBox = document.createElement('div')
        textBox.innerHTML = text
        loadingInner.appendChild(loadingIcon)
        loadingInner.appendChild(textBox)
        loadingBox.appendChild(loadingInner)
        fragment.appendChild(loadingBox)
        document.body.appendChild(fragment)
    },
    hideLoading() {
        document.querySelector('#loadingBox').remove()
    },
    showToast(text, duration = 3000) {
        const toastBox = document.createElement('div')
        toastBox.id = 'toastBox'
        toastBox.classList.add('toast', 'fixed', 'inset-0', 'z-10', 'flex', 'justify-center', 'items-center', 'bg-black/25')
        const toastInner = document.createElement('div')
        toastInner.classList.add('toast-inner', 'flex', 'justify-center', 'items-center', 'mt-10%', 'p-6', 'text-white', 'text-xl', 'bg-black/80', 'rounded-lg', 'max-w-[500px]')
        const textBox = document.createElement('div')
        textBox.innerHTML = text
        toastInner.appendChild(textBox)
        toastBox.appendChild(toastInner)
        fragment.appendChild(toastBox)
        document.body.appendChild(fragment)
        setTimeout(() => {
            ui.hideToast()
        }, duration)
    },
    hideToast() {
        document.querySelector('#toastBox').remove()
    }
}
