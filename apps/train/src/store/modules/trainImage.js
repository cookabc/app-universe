import {defineStore} from 'pinia'
import {nanoid as _nanoid} from 'nanoid'

const DEFAULT_CLASSES = [
    {
        id: _nanoid(),
        name: 'Class 1',
        handledName: 'Class_1',
        disabled: false,
        isEditName: false,
        showCamera: false,
        showUpload: false,
        tempName: null,
        samples: []
    },
    {
        id: _nanoid(),
        name: 'Class 2',
        handledName: 'Class_2',
        disabled: false,
        isEditName: false,
        showCamera: false,
        showUpload: false,
        tempName: null,
        samples: []
    }
]
export const useTrainImageStore = defineStore('trainImage', {
    persist: true,
    state() {
        return {
            isTrained: false,
            classes: DEFAULT_CLASSES
        }
    },
    getters: {
        trainingData: (state) => {
            const samples = state.classes.map(item => {
                if (!item.disabled) {
                    return item.samples
                } else {
                    return []
                }
            })
            return [].concat(...samples)
        }
    },
    actions: {
        addClass() {
            const classItem = {
                id: _nanoid(),
                name: `Class ${this.classes.length + 1}`,
                handledName: `Class_${this.classes.length + 1}`,
                disabled: false,
                isEditName: false,
                showCamera: false,
                showUpload: false,
                tempName: null,
                samples: []
            }
            this.classes.push(classItem)
        },
        removeClass(item) {
            const index = this.classes.findIndex(c => c.id === item.id)
            this.classes.splice(index, 1)
        },
        resetClasses() {
            this.classes = DEFAULT_CLASSES
        }
    }
})
