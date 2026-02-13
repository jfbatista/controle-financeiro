import { useState } from 'react';
import { httpPost } from '../services/http';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface FirstUserResponse {
  id: number;
  name: string;
  email: string;
  company: {
    id: number;
    name: string;
  };
}

export function FirstUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await httpPost<FirstUserResponse, any>('/users/first', {
        name,
        email,
        password,
        companyName,
      });
      toast({
        title: 'Sucesso!',
        description: 'Usuário inicial criado. Faça login para continuar.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar usuário',
        description: error?.message || 'Verifique os dados e tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="md" py={12} px={4}>
        <Box bg="white" p={8} borderRadius="xl" boxShadow="lg">
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading size="lg" textAlign="center" color="brand.600">
              Primeiro Acesso
            </Heading>

            <FormControl isRequired>
              <FormLabel>Seu Nome</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
              />
            </FormControl>

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

            <FormControl>
              <FormLabel>Nome da Empresa</FormLabel>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Minha Loja"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              isLoading={loading}
              loadingText="Criando..."
            >
              Criar usuário inicial
            </Button>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}
