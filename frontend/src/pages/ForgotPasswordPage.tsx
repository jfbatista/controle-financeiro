import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    Heading,
    useColorModeValue,
    Link as ChakraLink,
    Container,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomToast } from '../hooks/useCustomToast';
import axios from 'axios';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useCustomToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:3000/auth/forgot-password', { email });
            toast.success('Se o e-mail estiver cadastrado, você receberá um link de recuperação.');
            // Optional: redirect to login after a delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            toast.error('Ocorreu um erro ao solicitar a recuperação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', md: '8' }}>
            <Stack spacing="8">
                <Stack spacing="6" textAlign="center">
                    <Heading size="xl" fontWeight="extrabold">
                        Recuperar Senha
                    </Heading>
                    <Text color="gray.500">
                        Digite seu e-mail para receber o link de redefinição de senha
                    </Text>
                </Stack>
                <Box
                    py={{ base: '0', md: '8' }}
                    px={{ base: '4', md: '10' }}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={{ base: 'none', md: 'xl' }}
                    borderRadius={{ base: 'none', md: 'xl' }}
                >
                    <Stack spacing="6" as="form" onSubmit={handleSubmit}>
                        <FormControl id="email" isRequired>
                            <FormLabel>E-mail</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            colorScheme="brand"
                            size="lg"
                            fontSize="md"
                            isLoading={loading}
                        >
                            Enviar Link
                        </Button>
                        <Text align="center">
                            Lembrou a senha?{' '}
                            <ChakraLink as={Link} to="/login" color="brand.500">
                                Entrar
                            </ChakraLink>
                        </Text>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}
