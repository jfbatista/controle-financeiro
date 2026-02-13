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

            <Box as="form" onSubmit={handleSave} bg="white" p="6" borderRadius="xl" shadow="sm">
                <VStack spacing={6} align="stretch">

                    <Box>
                        <Heading size="md" mb="4">Dados Gerais</Heading>
                        <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
                            <FormControl isRequired>
                                <FormLabel>Nome da Empresa</FormLabel>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>CNPJ / Documento</FormLabel>
                                <Input
                                    value={data.document || ''}
                                    onChange={(e) => setData({ ...data, document: e.target.value })}
                                />
                            </FormControl>
                        </Flex>

                        <FormControl mt="4">
                            <FormLabel>E-mail de Contato</FormLabel>
                            <Input
                                type="email"
                                value={data.contactEmail || ''}
                                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                            />
                        </FormControl>
                    </Box>

                    <Divider />

                    <Box>
                        <Heading size="md" mb="2">Configuração de E-mail (SMTP)</Heading>
                        <Text fontSize="sm" color="gray.500" mb="4">
                            Necessário para envio de e-mails do sistema (ex: recuperação de senha).
                        </Text>

                        <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
                            <FormControl flex={2}>
                                <FormLabel>Servidor SMTP (Host)</FormLabel>
                                <Input
                                    placeholder="smtp.exemplo.com"
                                    value={data.smtpHost || ''}
                                    onChange={(e) => setData({ ...data, smtpHost: e.target.value })}
                                />
                            </FormControl>

                            <FormControl flex={1}>
                                <FormLabel>Porta</FormLabel>
                                <Input
                                    type="number"
                                    placeholder="587"
                                    value={data.smtpPort || ''}
                                    onChange={(e) => setData({ ...data, smtpPort: Number(e.target.value) })}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center" mt="8">
                                <FormLabel htmlFor="smtp-secure" mb="0">
                                    Usar SSL/TLS?
                                </FormLabel>
                                <Switch
                                    id="smtp-secure"
                                    isChecked={data.smtpSecure}
                                    onChange={(e) => setData({ ...data, smtpSecure: e.target.checked })}
                                />
                            </FormControl>
                        </Flex>

                        <Flex gap="4" direction={{ base: 'column', md: 'row' }} mt="4">
                            <FormControl>
                                <FormLabel>Usuário SMTP</FormLabel>
                                <Input
                                    placeholder="usuario@exemplo.com"
                                    value={data.smtpUser || ''}
                                    onChange={(e) => setData({ ...data, smtpUser: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Senha SMTP</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="********"
                                    value={data.smtpPass || ''}
                                    onChange={(e) => setData({ ...data, smtpPass: e.target.value })}
                                />
                            </FormControl>
                        </Flex>

                        <FormControl mt="4">
                            <FormLabel>E-mail de Remetente (From)</FormLabel>
                            <Input
                                placeholder="nao-responda@suaempresa.com"
                                value={data.smtpFrom || ''}
                                onChange={(e) => setData({ ...data, smtpFrom: e.target.value })}
                            />
                            <Text fontSize="xs" color="gray.500">
                                Se vazio, será usado o usuário SMTP ou padrão do sistema.
                            </Text>
                        </FormControl>
                    </Box>

                    <Button
                        type="submit"
                        colorScheme="brand"
                        leftIcon={<Save size={18} />}
                        alignSelf="flex-end"
                        isLoading={loading}
                    >
                        Salvar Configurações
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
