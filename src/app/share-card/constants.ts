export const GRADIENTS = [
    'bg-gradient-to-br from-blue-600 to-purple-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-orange-300 to-rose-300',
    'bg-gradient-to-br from-purple-600 to-blue-800',
    'bg-gradient-to-br from-cyan-400 to-blue-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-pink-500 to-purple-500',
    'bg-gradient-to-br from-teal-400 to-emerald-500',
]

export const TEMPLATES = [
    { id: 'modern', name: '现代', bg: 'bg-[#293845]', textColor: 'text-white' },
    {
        id: 'minimal',
        name: '简约',
        bg: 'bg-white/90',
        textColor: 'text-[#293845]',
    },
    {
        id: 'ticket',
        name: '登机牌',
        bg: 'bg-white/90',
        textColor: 'text-[#293845]',
    },
]

export const LANGUAGES: Record<string, any> = {
    zh: {
        title: '艺术中的设计',
        content:
            '艺术中的设计是对创造性流动中各种事物、各种元素之间关系的认识.

你不能发明一个设计.
你在第四维度中认识它.

也就是说，用你的血液和骨骼，以及你的眼睛来认识它。',
        author: 'D. H. 劳伦斯',
        madeBy: '{name} 制作',
        words: '字数',
        edit: '编辑',
        download: '下载',
        editAndSettings: '编辑与设置',
        date: '日期',
        maker: '制作者',
        titlePlaceholder: '标题',
        contentPlaceholder: '内容',
        authorPlaceholder: '作者',
        fontColor: '字体颜色',
        fontSize: '字体大小',
        fontStyle: '字体样式',
        alignment: '对齐',
        lineHeight: '行高',
        cardContent: '卡片内容',
        styleSettings: '样式设置',
        generalSettings: '常规设置',
    },
    en: {
        title: 'Design in art',
        content:
            "Design in art, is a recognition of the relation between various things, various elements in the creative flux. 

You can't invent a design. 
You recognize it, in the fourth dimension. 

That is, with your blood and your bones, as well as with your eyes.",
        author: 'D. H. Lawrence',
        madeBy: 'Made by {name}',
        words: 'Words',
        edit: 'Edit',
        download: 'Download',
        editAndSettings: 'Edit & Settings',
        date: 'Date',
        maker: 'Maker',
        titlePlaceholder: 'Title',
        contentPlaceholder: 'Content',
        authorPlaceholder: 'Author',
        fontColor: 'Font Color',
        fontSize: 'Font Size',
        fontStyle: 'Font Style',
        alignment: 'Alignment',
        lineHeight: 'Line Height',
        cardContent: 'Card Content',
        styleSettings: 'Style Settings',
        generalSettings: 'General Settings',
    },
}

export const DEFAULT_TITLE_STYLE = {
    fontSize: '32px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
}

export const DEFAULT_CONTENT_STYLE = {
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    lineHeight: '1.5',
}
