import { motion } from 'framer-motion'

interface GameGridProps {
    matrix: string[][]
    isCellSelected: (row: number, col: number) => boolean
    isCellFound: (row: number, col: number) => boolean
    getCellColor: (row: number, col: number) => string
    handleCellMouseDown: (row: number, col: number) => void
    handleCellMouseEnter: (row: number, col: number) => void
    handleCellMouseUp: () => void
}

export function GameGrid({
    matrix,
    isCellSelected,
    isCellFound,
    getCellColor,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
}: GameGridProps) {
    return (
        <div
            className="grid gap-1"
            style={{
                gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))`,
            }}
        >
            {matrix.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-12 h-12 flex items-center justify-center border-2 rounded-md font-bold text-2xl cursor-pointer transition-all duration-300 ${
                            isCellSelected(rowIndex, colIndex)
                                ? 'bg-yellow-300 text-purple-800'
                                : isCellFound(rowIndex, colIndex)
                                ? 'bg-white text-purple-900 shadow-lg scale-105'
                                : 'bg-white/20'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                        style={{
                            color: isCellFound(rowIndex, colIndex) ? getCellColor(rowIndex, colIndex) : undefined,
                            textShadow: isCellFound(rowIndex, colIndex) ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                        }}
                        role="button"
                        aria-pressed={isCellSelected(rowIndex, colIndex)}
                        aria-label={`Row ${rowIndex + 1}, Col ${colIndex + 1}, ${isCellFound(rowIndex, colIndex) ? 'found' : 'not found'}`}
                    >
                        {cell}
                    </motion.div>
                )),
            )}
        </div>
    )
}
