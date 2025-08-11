import { LEVELS } from '../constants'

export function generateMatrix(words: string[], size: number): string[][] {
    const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => ''))

    for (const word of words) {
        let placed = false
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'
            const row = Math.floor(Math.random() * size)
            const col = Math.floor(Math.random() * size)

            if (canPlaceWord(matrix, word, row, col, direction, size)) {
                placeWord(matrix, word, row, col, direction)
                placed = true
            }
        }
    }

    const chineseChars =
        '的一是在不了有人和这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞'
    for (let i = 0; i < size; i++) {
        const matrixRow = matrix[i]
        if (!Array.isArray(matrixRow)) continue
        for (let j = 0; j < size; j++) {
            if (typeof matrixRow[j] !== 'undefined' && matrixRow[j] === '') {
                matrixRow[j] = chineseChars[Math.floor(Math.random() * chineseChars.length)] as string
            }
        }
    }

    return matrix
}

function canPlaceWord(matrix: string[][], word: string, row: number, col: number, direction: string, size: number): boolean {
    if (direction === 'horizontal' && col + word.length > size) return false
    if (direction === 'vertical' && row + word.length > size) return false

    for (let i = 0; i < word.length; i++) {
        const currentRow = direction === 'horizontal' ? row : row + i
        const currentCol = direction === 'horizontal' ? col + i : col
        if (!matrix[currentRow] || (matrix[currentRow][currentCol] !== '' && matrix[currentRow][currentCol] !== word[i])) {
            return false
        }
    }
    return true
}

function placeWord(matrix: string[][], word: string, row: number, col: number, direction: string) {
    for (let i = 0; i < word.length; i++) {
        const currentRow = direction === 'horizontal' ? row : row + i
        const currentCol = direction === 'horizontal' ? col + i : col
        const currentRowArr = matrix[currentRow]
        if (!currentRowArr) continue
        currentRowArr[currentCol] = word[i] as string
    }
}
