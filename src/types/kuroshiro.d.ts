declare module 'kuroshiro' {
    export default class Kuroshiro {
        init(analyzer: any): Promise<void>
        convert(str: string, options?: { to: 'hiragana' | 'katakana' | 'romaji' | 'kanji' }): Promise<string>
    }
}

declare module 'kuroshiro-analyzer-kuromoji' {
    const KuromojiAnalyzer: any
    export default KuromojiAnalyzer
}
