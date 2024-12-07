export const SAMPLE_TEXT =
    'Half the time she did things not simply, not for themselves; but to make people think this or that; perfect idiocy she knew for no one was ever for a second taken in.'

export const VIRTUAL_KEYBOARD_KEYS = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'Backspace',
] as const

export const MOBILE_BREAKPOINT = 768

export const CELEBRATION_EFFECT_CONFIG = {
    particleCount: 100,
    gravity: 0.05,
    colorRange: {
        hueStart: 0,
        hueEnd: 360,
        saturation: 100,
        lightness: '50%',
    },
}

export const TYPING_EFFECT_CONFIG = {
    particleCount: 5,
    gravity: 0.1,
    colorRange: {
        hueStart: 180,
        hueEnd: 230,
        saturation: 100,
        lightness: '70%',
    },
}
