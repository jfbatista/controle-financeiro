import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';
import { useCustomToast } from '../hooks/useCustomToast';
import {
    Box,
    Heading,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Flex,
    Switch,
    Divider,
    Text,
    Alert,
    AlertIcon,
    SimpleGrid,
} from '@chakra-ui/react';
import { Save } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { Permission } from '../config/permissions';

interface CompanySettings {
    name: string;
    document?: string;
    contactEmail?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    smtpSecure?: boolean;
    smtpFrom?: string;
}

export function CompanySettingsPage() {
    const api = useAuthApi();
    const toast = useCustomToast();
    const can = useAuthStore((state) => state.can);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CompanySettings>({
        name: '',
        smtpSecure: true,
    });

    const hasPermission = can(Permission.COMPANY_MANAGE) || can(Permission.SETTINGS_MANAGE);

    useEffect(() => {
        if (hasPermission) {
            loadData();
        }
    }, [hasPermission]);

    async function loadData() {
        try {
            const company = await api.get<CompanySettings>('/companies/me');
            setData(company);
        } catch (e: any) {
            toast.error('Erro ao carregar dados da empresa', e?.message);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            // Only send fields that are in UpdateCompanyDto
            const payload = {
                name: data.name,
                document: data.document,
                contactEmail: data.contactEmail,
                smtpHost: data.smtpHost,
                smtpPort: data.smtpPort ? Number(data.smtpPort) : undefined,
                smtpUser: data.smtpUser,
                smtpPass: data.smtpPass,
                smtpSecure: data.smtpSecure,
                smtpFrom: data.smtpFrom,
            };
            await api.put('/companies/me', payload);
            toast.success('Configurações salvas com sucesso!');
        } catch (e: any) {
            toast.error('Erro ao salvar', e?.message);
        } finally {
            setLoading(false);
        }
    }

    if (!hasPermission) {
        return (
            <Alert status="error">
                <AlertIcon />
                Você não tem permissão para acessar esta página.
            </Alert>
        );
    }

    return (
        <Box>
            <Heading size="lg" mb="6">Configurações da Empresa</Heading>

            <Box as="form" onSubmit={handleSave} bg="white" p={8} borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100">
                <VStack spacing={8} align="stretch">

                    <Box>
                        <Heading size="md" mb="6" color="gray.700">Dados Gerais</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="gray.500">Nome da Empresa</FormLabel>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" color="gray.500">CNPJ / Documento</FormLabel>
                                <Input
                                    value={data.document || ''}
                                    onChange={(e) => setData({ ...data, document: e.target.value })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>

                            <FormControl gridColumn={{ md: "span 2" }}>
                                <FormLabel fontSize="sm" color="gray.500">E-mail de Contato</FormLabel>
                                <Input
                                    type="email"
                                    value={data.contactEmail || ''}
                                    onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>
                        </SimpleGrid>
                    </Box>

                    <Divider borderColor="gray.200" />

                    <Box>
                        <Heading size="md" mb="2" color="gray.700">Configuração de E-mail (SMTP)</Heading>
                        <Text fontSize="sm" color="gray.500" mb="6">
                            Necessário para envio de e-mails do sistema (ex: recuperação de senha).
                        </Text>

                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                            <FormControl gridColumn={{ md: "span 2" }}>
                                <FormLabel fontSize="sm" color="gray.500">Servidor SMTP (Host)</FormLabel>
                                <Input
                                    placeholder="smtp.exemplo.com"
                                    value={data.smtpHost || ''}
                                    onChange={(e) => setData({ ...data, smtpHost: e.target.value })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" color="gray.500">Porta</FormLabel>
                                <Input
                                    type="number"
                                    placeholder="587"
                                    value={data.smtpPort || ''}
                                    onChange={(e) => setData({ ...data, smtpPort: Number(e.target.value) })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent={{ md: "flex-start" }} pt={{ md: 6 }}>
                                <FormLabel htmlFor="smtp-secure" mb="0" mr={3} fontSize="sm" color="gray.500">
                                    Usar SSL/TLS?
                                </FormLabel>
                                <Switch
                                    id="smtp-secure"
                                    isChecked={data.smtpSecure}
                                    onChange={(e) => setData({ ...data, smtpSecure: e.target.checked })}
                                    colorScheme="brand"
                                />
                            </FormControl>

                            <FormControl gridColumn={{ md: "span 2" }}>
                                <FormLabel fontSize="sm" color="gray.500">Usuário SMTP</FormLabel>
                                <Input
                                    placeholder="usuario@exemplo.com"
                                    value={data.smtpUser || ''}
                                    onChange={(e) => setData({ ...data, smtpUser: e.target.value })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>

                            <FormControl gridColumn={{ md: "span 2" }}>
                                <FormLabel fontSize="sm" color="gray.500">Senha SMTP</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="********"
                                    value={data.smtpPass || ''}
                                    onChange={(e) => setData({ ...data, smtpPass: e.target.value })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>

                            <FormControl gridColumn={{ md: "span 4" }}>
                                <FormLabel fontSize="sm" color="gray.500">E-mail de Remetente (From)</FormLabel>
                                <Input
                                    placeholder="nao-responda@suaempresa.com"
                                    value={data.smtpFrom || ''}
                                    onChange={(e) => setData({ ...data, smtpFrom: e.target.value })}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                                <Text fontSize="xs" color="gray.400" mt={1}>
                                    Se vazio, será usado o usuário SMTP ou padrão do sistema.
                                </Text>
                            </FormControl>
                        </SimpleGrid>
                    </Box>

                    <Flex justify="flex-end" pt={4}>
                        <Button
                            type="submit"
                            colorScheme="brand"
                            leftIcon={<Save size={18} />}
                            size="lg"
                            isLoading={loading}
                            px={8}
                            boxShadow="md"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                        >
                            Salvar Configurações
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Box>
    );
}
