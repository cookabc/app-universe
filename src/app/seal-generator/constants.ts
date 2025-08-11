export const SEAL_CONFIG = {
    SIZE: 300,
    PADDING: 10,
    COLOR: '#FF0000',
    STAR: {
        SCALE: 0.3,
        INNER_RATIO: 0.382, // Golden ratio
    },
    FONT: {
        FAMILY: 'SimSun',
        COMPANY_SIZE_RATIO: 8,
        REGISTRATION_SIZE_RATIO: 10,
        MAX_COMPANY_SIZE: 24,
        MAX_REGISTRATION_SIZE: 18,
    },
    TEXT_RADIUS_OFFSET: 25,
    ANGLES: {
        COMPANY_START: Math.PI * 0.88,
        COMPANY_END: Math.PI * 0.2,
        REGISTRATION_START: Math.PI * 0.25,
        REGISTRATION_END: Math.PI * 0.75,
    },
} as const
