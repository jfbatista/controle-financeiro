import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    colors: {
        brand: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981', // Emerald 500
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
        },
    },
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
    styles: {
        global: {
            'html, body': {
                backgroundColor: 'gray.50',
                color: 'gray.800',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'bold',
                borderRadius: 'lg',
            },
            defaultProps: {
                colorScheme: 'brand',
            },
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'xl',
                    boxShadow: 'sm',
                },
            },
        },
    },
});

export default theme;
