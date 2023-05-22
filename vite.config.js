import { resolve } from 'path'
const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true,
        open: !isCodeSandbox // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: {
              main: resolve(__dirname, 'src/index.html'),
              experience: resolve(__dirname, 'src/experience.html'),
              backOffice: resolve(__dirname, 'src/back-office.html'),
            },
        },
    }
}