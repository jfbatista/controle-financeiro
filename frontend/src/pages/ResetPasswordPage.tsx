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
    Container,
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomToast } from '../hooks/useCustomToast';
import axios from 'axios';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useCustomToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error('Token inválido ou ausente.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('As senhas não conferem.');
            return;
        }
        if (password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/reset-password', {
                token,
                newPassword: password,
            });
            toast.success('Senha redefinida com sucesso! Você pode fazer login agora.');
            navigate('/login');
        } catch (error) {
            toast.error('Erro ao redefinir senha. O link pode ter expirado.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Container maxW="lg" py="24" textAlign="center">
                <Heading size="lg" color="red.500" mb="4">Link Inválido</Heading>
                <Text>O link de recuperação é inválido ou não foi fornecido.</Text>
                <Button mt="8" onClick={() => navigate('/login')} colorScheme="brand">
                    Voltar para Login
                </Button>
            </Container>
        );
    }

    return (
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', md: '8' }}>
            <Stack spacing="8">
                <Stack spacing="6" textAlign="center">
                    <Heading size="xl" fontWeight="extrabold">
                        Redefinir Senha
                    </Heading>
                    <Text color="gray.500">
                        Crie uma nova senha para sua conta
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
                        <FormControl id="password" isRequired>
                            <FormLabel>Nova Senha</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="confirm-password" isRequired>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            colorScheme="brand"
                            size="lg"
                            fontSize="md"
                            isLoading={loading}
                        >
                            Salvar Nova Senha
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}
