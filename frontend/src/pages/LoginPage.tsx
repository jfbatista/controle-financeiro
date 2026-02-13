import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCustomToast } from '../hooks/useCustomToast';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Text,
  Link,
  VStack,
  Container,
} from '@chakra-ui/react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, clearError } = useAuthStore();
  const toast = useCustomToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    await login(email, password);
    const currentError = useAuthStore.getState().error;
    if (currentError) {
      toast.error('Erro ao entrar', currentError);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="md" py={12} px={4}>
        <Box bg="white" p={8} borderRadius="xl" boxShadow="lg">
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading size="lg" textAlign="center" color="brand.600">
              Controle Financeiro
            </Heading>
            <Text fontSize="md" color="gray.600" textAlign="center">
              Acesse sua conta para continuar
            </Text>

            <FormControl isRequired>
              <FormLabel>E-mail</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              isLoading={loading}
              loadingText="Entrando..."
            >
              Entrar
            </Button>

            <Flex justify="center" width="full">
              <Link href="/forgot-password" color="brand.500" fontSize="sm">
                Esqueci minha senha
              </Link>
            </Flex>

            <Text fontSize="sm" color="gray.600">
              Primeiro uso?{' '}
              <Link href="/first-access" color="brand.500" fontWeight="bold">
                Criar usuário inicial
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}
