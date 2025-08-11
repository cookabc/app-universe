import { SEAL_CONFIG } from '../constants'

interface DrawArcTextProps {
    ctx: CanvasRenderingContext2D
    text: string
    startAngle: number
    endAngle: number
    radius: number
    fontSize: number
    centerX: number
    centerY: number
    isUpsideDown?: boolean
}

function drawArcText({
    ctx,
    text,
    startAngle,
    endAngle,
    radius,
    fontSize,
    centerX,
    centerY,
    isUpsideDown = false,
}: DrawArcTextProps) {
    ctx.font = `${fontSize}px ${SEAL_CONFIG.FONT.FAMILY}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const chars = text.split('')
    const totalAngle = endAngle > startAngle ? endAngle - startAngle : Math.PI * 2 - startAngle + endAngle
    const angleStep = totalAngle / chars.length

    chars.forEach((char, i) => {
        const angle = startAngle + angleStep * i
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle + (isUpsideDown ? -Math.PI / 2 : Math.PI / 2))
        ctx.fillText(char, 0, 0)
        ctx.restore()
    })
}

function drawStar(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
    const starRadius = radius * SEAL_CONFIG.STAR.SCALE
    const starInnerRadius = starRadius * SEAL_CONFIG.STAR.INNER_RATIO

    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2
        const innerAngle = outerAngle + Math.PI / 5

        const outerX = centerX + Math.cos(outerAngle) * starRadius
        const outerY = centerY + Math.sin(outerAngle) * starRadius
        const innerX = centerX + Math.cos(innerAngle) * starInnerRadius
        const innerY = centerY + Math.sin(innerAngle) * starInnerRadius

        i === 0 ? ctx.moveTo(outerX, outerY) : ctx.lineTo(outerX, outerY)
        ctx.lineTo(innerX, innerY)
    }
    ctx.closePath()
    ctx.fill()
}

export function generateSealImage(companyName: string, registrationNumber: string): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    canvas.width = SEAL_CONFIG.SIZE
    canvas.height = SEAL_CONFIG.SIZE
    const centerX = SEAL_CONFIG.SIZE / 2
    const centerY = SEAL_CONFIG.SIZE / 2
    const radius = SEAL_CONFIG.SIZE / 2 - SEAL_CONFIG.PADDING

    ctx.clearRect(0, 0, SEAL_CONFIG.SIZE, SEAL_CONFIG.SIZE)
    ctx.strokeStyle = SEAL_CONFIG.COLOR
    ctx.fillStyle = SEAL_CONFIG.COLOR

    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2)
    ctx.stroke()

    drawStar(ctx, centerX, centerY, radius)

    drawArcText({
        ctx,
        text: companyName,
        startAngle: SEAL_CONFIG.ANGLES.COMPANY_START,
        endAngle: SEAL_CONFIG.ANGLES.COMPANY_END,
        radius: radius - SEAL_CONFIG.TEXT_RADIUS_OFFSET,
        fontSize: Math.min(radius / SEAL_CONFIG.FONT.COMPANY_SIZE_RATIO, SEAL_CONFIG.FONT.MAX_COMPANY_SIZE),
        centerX,
        centerY,
    })

    drawArcText({
        ctx,
        text: [...registrationNumber].reverse().join(''),
        startAngle: SEAL_CONFIG.ANGLES.REGISTRATION_START,
        endAngle: SEAL_CONFIG.ANGLES.REGISTRATION_END,
        radius: radius - SEAL_CONFIG.TEXT_RADIUS_OFFSET,
        fontSize: Math.min(
            radius / SEAL_CONFIG.FONT.REGISTRATION_SIZE_RATIO,
            SEAL_CONFIG.FONT.MAX_REGISTRATION_SIZE,
        ),
        centerX,
        centerY,
        isUpsideDown: true,
    })

    return canvas.toDataURL()
}
