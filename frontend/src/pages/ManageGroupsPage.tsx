import { useEffect, useState } from 'react';
import { useCustomToast } from '../hooks/useCustomToast';
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    HStack,
    VStack,
    Checkbox,
    SimpleGrid,
    Text,
    Badge,
} from '@chakra-ui/react';
import { Edit2, Plus, Trash2, Users } from 'lucide-react';
import { useGroupsService, type Group, type CreateGroupDto } from '../services/groupsService';
import { Permission } from '../config/permissions';
import { useAuthStore } from '../store/auth';

const PERMISSION_LABELS: Record<Permission, string> = {
    [Permission.TRANSACTION_VIEW]: 'Visualizar Lançamentos',
    [Permission.TRANSACTION_CREATE]: 'Criar Lançamentos',
    [Permission.TRANSACTION_EDIT]: 'Editar Lançamentos',
    [Permission.TRANSACTION_DELETE]: 'Excluir Lançamentos',
    [Permission.USER_VIEW]: 'Visualizar Usuários',
    [Permission.USER_INVITE]: 'Adicionar Usuários',
    [Permission.USER_EDIT]: 'Editar Usuários',
    [Permission.USER_DELETE]: 'Excluir Usuários',
    [Permission.REPORT_VIEW]: 'Visualizar Relatórios',
    [Permission.AUDIT_VIEW]: 'Visualizar Auditoria',
    [Permission.SETTINGS_MANAGE]: 'Gerenciar Configurações',
    [Permission.COMPANY_MANAGE]: 'Gerenciar Empresa',
    [Permission.CATEGORY_VIEW]: 'Visualizar Categorias',
    [Permission.CATEGORY_CREATE]: 'Criar Categorias',
    [Permission.CATEGORY_EDIT]: 'Editar Categorias',
    [Permission.CATEGORY_DELETE]: 'Excluir Categorias',
    [Permission.PAYMENT_METHOD_VIEW]: 'Visualizar Formas de Pagamento',
    [Permission.PAYMENT_METHOD_CREATE]: 'Criar Formas de Pagamento',
    [Permission.PAYMENT_METHOD_EDIT]: 'Editar Formas de Pagamento',
    [Permission.PAYMENT_METHOD_DELETE]: 'Excluir Formas de Pagamento',
    [Permission.RECURRING_BILL_VIEW]: 'Visualizar Contas Fixas',
    [Permission.RECURRING_BILL_CREATE]: 'Criar Contas Fixas',
    [Permission.RECURRING_BILL_EDIT]: 'Editar Contas Fixas',
    [Permission.RECURRING_BILL_DELETE]: 'Excluir Contas Fixas',
};

const PERMISSION_GROUPS = {
    'Lançamentos': [
        Permission.TRANSACTION_VIEW,
        Permission.TRANSACTION_CREATE,
        Permission.TRANSACTION_EDIT,
        Permission.TRANSACTION_DELETE,
    ],
    'Contas Fixas': [
        Permission.RECURRING_BILL_VIEW,
        Permission.RECURRING_BILL_CREATE,
        Permission.RECURRING_BILL_EDIT,
        Permission.RECURRING_BILL_DELETE,
    ],
    'Relatórios': [
        Permission.REPORT_VIEW,
    ],
    'Auditoria': [
        Permission.AUDIT_VIEW,
    ],
    'Usuários': [
        Permission.USER_VIEW,
        Permission.USER_INVITE,
        Permission.USER_EDIT,
        Permission.USER_DELETE,
    ],
    'Categorias': [
        Permission.CATEGORY_VIEW,
        Permission.CATEGORY_CREATE,
        Permission.CATEGORY_EDIT,
        Permission.CATEGORY_DELETE,
    ],
    'Formas de Pagamento': [
        Permission.PAYMENT_METHOD_VIEW,
        Permission.PAYMENT_METHOD_CREATE,
        Permission.PAYMENT_METHOD_EDIT,
        Permission.PAYMENT_METHOD_DELETE,
    ],
    'Configurações': [
        Permission.SETTINGS_MANAGE,
        Permission.COMPANY_MANAGE,
    ],
};

export function ManageGroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const toast = useCustomToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { can } = useAuthStore();
    const { getAll, create, update, delete: deleteGroup } = useGroupsService();

    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [formData, setFormData] = useState<CreateGroupDto>({ name: '', permissions: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadGroups();
    }, []);

    async function loadGroups() {
        try {
            const data = await getAll();
            setGroups(data);
        } catch (error) {
            toast.error('Erro ao carregar grupos');
        }
    }

    function handleOpenModal(group?: Group) {
        if (group) {
            setEditingGroup(group);
            setFormData({
                name: group.name,
                permissions: group.permissions.map(p => p.permission),
            });
        } else {
            setEditingGroup(null);
            setFormData({ name: '', permissions: [] });
        }
        onOpen();
    }

    async function handleSave() {
        if (!formData.name) {
            toast.error('Nome do grupo é obrigatório');
            return;
        }

        try {
            setLoading(true);
            if (editingGroup) {
                await update(editingGroup.id, formData);
                toast.success('Grupo atualizado com sucesso');
            } else {
                await create(formData);
                toast.success('Grupo criado com sucesso');
            }
            onClose();
            loadGroups();
        } catch (error: any) {
            console.error('Save errorDetails:', error);
            const msg = error?.response?.data?.message || error?.message || 'Erro ao salvar grupo';
            toast.error(`Erro: ${msg}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm('Tem certeza que deseja excluir este grupo?')) return;

        try {
            await deleteGroup(id);
            toast.success('Grupo excluído');
            loadGroups();
        } catch (error) {
            toast.error('Erro ao excluir grupo');
        }
    }

    function togglePermission(permission: Permission) {
        setFormData(prev => {
            const has = prev.permissions.includes(permission);
            return {
                ...prev,
                permissions: has
                    ? prev.permissions.filter(p => p !== permission)
                    : [...prev.permissions, permission]
            };
        });
    }

    function toggleGroup(groupPermissions: Permission[]) {
        setFormData(prev => {
            const allSelected = groupPermissions.every(p => prev.permissions.includes(p));
            let newPermissions = [...prev.permissions];

            if (allSelected) {
                // Uncheck all
                newPermissions = newPermissions.filter(p => !groupPermissions.includes(p));
            } else {
                // Check all
                groupPermissions.forEach(p => {
                    if (!newPermissions.includes(p)) {
                        newPermissions.push(p);
                    }
                });
            }

            return { ...prev, permissions: newPermissions };
        });
    }

    return (
        <Box>
            <HStack justifyContent="space-between" mb={6}>
                <Heading size="lg">Gerenciar Grupos</Heading>
                {can(Permission.USER_INVITE) && (
                    <Button leftIcon={<Plus size={20} />} colorScheme="brand" onClick={() => handleOpenModal()}>
                        Novo Grupo
                    </Button>
                )}
            </HStack>

            <Box bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>Permissões</Th>
                            <Th width="100px">Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {groups.map((group) => (
                            <Tr key={group.id}>
                                <Td fontWeight="medium">{group.name}</Td>
                                <Td>
                                    <HStack wrap="wrap" spacing={2}>
                                        {group.permissions.length > 0 ? (
                                            <Badge colorScheme="blue">{group.permissions.length} permissões</Badge>
                                        ) : (
                                            <Badge colorScheme="gray">Nenhuma</Badge>
                                        )}
                                    </HStack>
                                </Td>
                                <Td>
                                    <HStack spacing={2}>
                                        {can(Permission.USER_EDIT) && (
                                            <IconButton
                                                aria-label="Editar"
                                                icon={<Edit2 size={18} />}
                                                size="sm"
                                                onClick={() => handleOpenModal(group)}
                                            />
                                        )}
                                        {can(Permission.USER_DELETE) && (
                                            <IconButton
                                                aria-label="Excluir"
                                                icon={<Trash2 size={18} />}
                                                colorScheme="red"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(group.id)}
                                            />
                                        )}
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editingGroup ? 'Editar Grupo' : 'Novo Grupo'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl mb={6}>
                            <FormLabel>Nome do Grupo</FormLabel>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Financeiro, Vendas..."
                            />
                        </FormControl>

                        <Text fontWeight="bold" mb={4}>Permissões</Text>
                        <VStack align="stretch" spacing={4}>
                            {Object.entries(PERMISSION_GROUPS).map(([category, perms]) => {
                                const allSelected = perms.every(p => formData.permissions.includes(p));
                                const someSelected = perms.some(p => formData.permissions.includes(p));
                                const isIndeterminate = someSelected && !allSelected;

                                return (
                                    <Box key={category} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                                        <HStack mb={3} justifyContent="space-between" borderBottomWidth="1px" pb={2} borderColor="gray.200">
                                            <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="gray.600" letterSpacing="wide">
                                                {category}
                                            </Text>
                                            <Checkbox
                                                isChecked={allSelected}
                                                isIndeterminate={isIndeterminate}
                                                onChange={() => toggleGroup(perms)}
                                                colorScheme="brand"
                                                size="sm"
                                            >
                                                Selecionar Todos
                                            </Checkbox>
                                        </HStack>
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                            {perms.map(perm => (
                                                <Checkbox
                                                    key={perm}
                                                    isChecked={formData.permissions.includes(perm)}
                                                    onChange={() => togglePermission(perm)}
                                                    colorScheme="brand"
                                                    bg="white"
                                                    p={2}
                                                    borderRadius="md"
                                                    borderColor="gray.200"
                                                    borderWidth="1px"
                                                    _hover={{ borderColor: 'brand.300' }}
                                                >
                                                    <Text fontSize="sm">{PERMISSION_LABELS[perm]}</Text>
                                                </Checkbox>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                );
                            })}
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="brand" mr={3} onClick={handleSave} isLoading={loading}>
                            Salvar
                        </Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
