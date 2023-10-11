import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import("@/views/index.vue")
        },
        {
            path: '/project',
            name: 'Project',
            component: () => import("@/views/project/index.vue"),
            meta: {
                title: "项目"
            },
            children: [
                {
                    path: '',
                    name: 'ProjectIndex',
                    component: () => import("@/views/project/index/index.vue"),
                    meta: {
                        title: "项目列表"
                    }
                },
                {
                    path: '/prepare',
                    name: 'ProjectPrepare',
                    component: () => import("@/views/project/prepare/index.vue"),
                    meta: {
                        title: "项目准备"
                    }
                },
                {
                    path: 'training',
                    name: 'ProjectTraining',
                    component: () => import("@/views/project/training/index.vue"),
                    meta: {
                        title: "训练"
                    }
                },
                {
                    path: 'models',
                    name: 'ProjectModels',
                    component: () => import("@/views/project/models/index.vue"),
                    meta: {
                        title: "模型"
                    }
                },
                {
                    path: 'makes',
                    name: 'ProjectMakes',
                    component: () => import("@/views/project/makes/index.vue"),
                    meta: {
                        title: "制作"
                    }
                }
            ]
        },
        {
            path: '/train',
            name: 'Train',
            component: () => import("@/views/train/index.vue"),
            meta: {
                title: "训练"
            },
            children: [
                {
                    path: '',
                    name: 'TrainIndex',
                    component: () => import("@/views/train/index/index.vue"),
                },
                {
                    path: 'image',
                    name: 'TrainImage',
                    component: () => import("@/views/train/image/index.vue"),
                },
            ]
        }
    ]
})

export default router
