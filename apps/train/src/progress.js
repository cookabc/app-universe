import router from "@/router"
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
NProgress.configure({
    showSpinner: false
})
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    next()
})
const bodyEle = document.querySelector('body')
router.afterEach((to, from) => {
    NProgress.done() // finish progress bar
    // 根据路由name给body添加class
    // store.commit('app/SET_SPINNING', false)
    bodyEle.classList.remove(from?.name?.toLowerCase() || 'no-name')
    bodyEle.classList.add(to?.name?.toLowerCase() || 'no-name')
})
