import {defineConfig, presetAttributify, presetUno} from 'unocss'

export default defineConfig({
    content: {
        pipeline: {
            exclude: ['node_modules', '.git', '.github', '.husky', '.vscode', 'build', 'dist', 'mock', 'public', './stats.html']
        }
    },
    presets: [presetUno(), presetAttributify()],
    shortcuts: [
        ['wh-full', 'w-full h-full'],
        ['f-c-c', 'flex justify-center items-center'],
        ['flex-col', 'flex flex-col'],
        ['absolute-lt', 'absolute left-0 top-0'],
        ['absolute-lb', 'absolute left-0 bottom-0'],
        ['absolute-rt', 'absolute right-0 top-0'],
        ['absolute-rb', 'absolute right-0 bottom-0'],
        ['absolute-center', 'absolute-lt f-c-c wh-full'],
        ['text-ellipsis', 'truncate'],
        ['login-button', 'bg-[#218380] h-54px rounded-999px w-full xl:w370px text-white text-22px'],
        ['nav-item', 'text-black text-32px px-6 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis font-medium ml-100px'],
        ['login-enter-button', 'block text-center bg-black text-white text-20px w-108px h-54px leading-54px rounded-20px border-0 cursor-pointer hover:(opacity-80 text-white)'],
        ['common-button', 'bg-white w-260px h-70px rounded-full p-0 border-0 text-35px border-7px border-solid border-black cursor-pointer font-500'],
        ['icon-btn', 'text-16 inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary !outline-none']
    ],
    rules: [
        [/^bc-(.+)$/, ([, color]) => ({'border-color': `#${color}`})]
    ],
    theme: {
        colors: {
            primary: 'var(--primary-color)',
            primary_hover: 'var(--primary-color-hover)',
            primary_pressed: 'var(--primary-color-pressed)',
            primary_active: 'var(--primary-color-active)',
            info: 'var(--info-color)',
            info_hover: 'var(--info-color-hover)',
            info_pressed: 'var(--info-color-pressed)',
            info_active: 'var(--info-color-active)',
            success: 'var(--success-color)',
            success_hover: 'var(--success-color-hover)',
            success_pressed: 'var(--success-color-pressed)',
            success_active: 'var(--success-color-active)',
            warning: 'var(--warning-color)',
            warning_hover: 'var(--warning-color-hover)',
            warning_pressed: 'var(--warning-color-pressed)',
            warning_active: 'var(--warning-color-active)',
            error: 'var(--error-color)',
            error_hover: 'var(--error-color-hover)',
            error_pressed: 'var(--error-color-pressed)',
            error_active: 'var(--error-color-active)',
            dark: '#18181c'
        }
    }
})
