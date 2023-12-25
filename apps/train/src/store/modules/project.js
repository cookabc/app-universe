import {defineStore} from 'pinia'
import {Modal} from 'ant-design-vue'
import {_nanoid} from "@/utils/index.js";

export const useProjectStore = defineStore('project', {
    persist: true,
    state() {
        return {
            projects: {},
            currentProjectId: '',
            model: {},
            labels: [],
            imgList: [],
            trainingData: {}
        }
    },
    getters: {
        currentProject: (state) => {
            if (state.currentProjectId) {
                return state.projects[state.currentProjectId]
            }
            return null
        }
    },
    actions: {
        deleteProject(project) {
            Modal.confirm({
                title: '温馨提示',
                content: `确定要删除【${project.name}】吗？（此操作不可撤销）`,
                okText: '确定',
                okType: 'danger',
                closable: true,
                onOk: () => {
                    delete this.projects[project.id]
                    console.log('[ this.projects ]-39', this.projects)
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        },
        async getProjectDetails(id) {
            try {
                this.currentProject = this.projects[id]
                console.log('[ this.currentProject ]-52', this.currentProject)
            } catch (e) {
                this.currentProject = null
            }
        },
        addTrainingLabel(label) {
            const currentProject = this.projects[this.currentProjectId]
            const labels = currentProject.labels
            if (labels.length > 0) {
                if (!labels.includes(label)) {
                    labels.push(label)
                }
            } else {
                labels.push(label)
            }
        },
        updateTrainingImg(label, imgUrl) {
            const currentLabel = this.trainingData.find(item => item.label === label)
            currentLabel.imgList.push({
                id: _nanoid(),
                src: imgUrl
            })
        },
        removeTrainingLabel(label) {
            Modal.confirm({
                title: '温馨提示',
                content: `确定要删除【${label}】吗？（此操作不可撤销）`,
                okText: '确定',
                okType: 'danger',
                closable: true,
                onOk: () => {
                    const labels = this.projects[this.currentProjectId].labels
                    const index = labels.findIndex(item => item === label)
                    labels.splice(index, 1)
                    this.trainingData[this.currentProjectId] = this.trainingData?.[this.currentProjectId]?.filter(item => item.label !== label);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        },
        removeTrainingImg(id) {
            const index = this.trainingData[this.currentProjectId].findIndex(item => item.id === id)
            this.trainingData[this.currentProjectId].splice(index, 1)
        },
        saveModel(model) {
            this.projects[this.currentProjectId].model = model
        },

        addProject(project) {
            const currentProject = this.projects[project.id]
            if (!currentProject) {
                this.projects[project.id] = project
            }
        },
        addTrainingData(label, imgUrl) {
            if (!this.trainingData[this.currentProjectId]) {
                this.trainingData[this.currentProjectId] = []
            }
            this.trainingData[this.currentProjectId].push({
                projectId: this.currentProjectId,
                id: _nanoid(),
                src: imgUrl,
                label
            })
        }
    }
})
