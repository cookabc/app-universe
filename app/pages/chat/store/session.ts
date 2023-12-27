import {defineStore} from 'pinia'
import {cloneDeep} from "lodash-es";
import {Session} from "~/types/session";
import {deleteSession, editSessionName, getSessionList} from "~/composables/session";

export const useSessionStore = defineStore('session', {
    state: () => ({
        sessionList: [] as Session[]
    }),
    getters: {
        formattedSessionList() {
            return () => {
                const sortedList = _sort(this.sessionList) as Session[]
                return classifyListByTime(sortedList)
            }
        },
    },
    actions: {
        async getSessionList(params?: { highlight?: any; }) {
            try {
                const highlight = params?.highlight
                const response = await getSessionList()
                const data = response.data.map((session: Session) => {
                    return {
                        ...session,
                        updated_at: new Date(session.updated_at).getTime(),
                        created_at: new Date(session.created_at).getTime(),
                        enableEdit: false,
                        enableDelete: false
                    }
                })
                if (highlight === 0) {
                    if (data.length) {
                        data[0].active = true
                    }
                }
                this.sessionList = cloneDeep(data)
            } catch (error) {
                console.warn('[ getSessionList error ]', error)
            }
        },
        editSessionName(session: Session) {
            const current =
                this.sessionList.find((item: Session) => item.id === session.id)
            if (current) {
                current.enableEdit = !current.enableEdit
            }
        },
        editSessionNameDone(payload: { id: string; newName: any; }) {
            const current =
                this.sessionList.find((item: Session) => item.id === payload.id)
            if (current) {
                current.name = payload.newName
                current.enableEdit = false
            }
        },
        async doEditSessionName(payload: { id: string; name: string; }) {
            const data = await editSessionName(payload)
            await this.getSessionList()
            return data;
        },
        deleteSession(session: Session) {
            const current =
                this.sessionList.find((item: Session) => item.id === session.id)
            if (current) {
                current.enableDelete = !current.enableDelete
            }
        },
        async doDeleteSession(payload: { id: string; }) {
            await deleteSession(payload)
            const index =
                this.sessionList.findIndex((item: Session) => item.id === payload.id)
            this.sessionList.splice(index, 1)
        },
    }
})

function _sort(array: any[]) {
    return array.sort((a, b) => b.updated_at - a.updated_at)
}

function classifyListByTime(list: Session[]) {
    const today = new Date();  // 获取当前日期
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);  // 获取昨天的日期

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);  // 获取7天前的日期

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);  // 获取30天前的日期

    const result = {
        "Today": [],
        "Yesterday": [],
        "Last 7 Days": [],
        "Last 30 Days": [],
        "30 Days Ago": []
    } as any;

    // 遍历列表数据，根据时间进行分类
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const itemDate = new Date(item.updated_at);  // 假设列表数据中的日期字段为 "date"
        // var monthYear = itemDate.getMonth() + 1 + "-" + itemDate.getFullYear();  // 获取月份和年份，格式为 MM-YYYY

        if (isSameDay(itemDate, today)) {
            result["Today"].push(item);
        } else if (isSameDay(itemDate, yesterday)) {
            result["Yesterday"].push(item);
        } else if (itemDate >= sevenDaysAgo && itemDate <= today) {
            result["Last 7 Days"].push(item);
        } else if (itemDate >= thirtyDaysAgo && itemDate <= today) {
            result["Last 30 Days"].push(item);
        } else if (itemDate < thirtyDaysAgo) {
            result["30 Days Ago"].push(item);
        }
    }

    return result;
}

// 判断两个日期是否为同一天
function isSameDay(date1: Date, date2: Date) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}
