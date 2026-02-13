import { useToast as useChakraToast, type UseToastOptions } from '@chakra-ui/react';

export function useCustomToast() {
    const toast = useChakraToast();

    const showToast = (title: string, status: 'success' | 'error' | 'warning' | 'info', description?: string) => {
        const options: UseToastOptions = {
            title,
            description,
            status,
            duration: 5000,
            isClosable: true,
            position: 'top-right',
            variant: 'subtle', // Modern, cleaner look
        };
        toast(options);
    };

    return {
        success: (title: string, description?: string) => showToast(title, 'success', description),
        error: (title: string, description?: string) => showToast(title, 'error', description),
        warning: (title: string, description?: string) => showToast(title, 'warning', description),
        info: (title: string, description?: string) => showToast(title, 'info', description),
    };
}
