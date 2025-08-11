import type { SharingCardState } from './types'

export const DEFAULT_CARD_DATA: SharingCardState = {
    date: new Date().toISOString().split('T')[0] ?? '',
    mainText: '伟大的事物从来没有伟大的开端',
    author: '约瑟夫·德·迈斯特',
    creator: '@Anata',
    backgroundImage: '',
}
