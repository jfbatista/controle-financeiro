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
    Badge,
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
    Select,
    HStack,
    Text,
} from '@chakra-ui/react';
import { Trash2, UserPlus } from 'lucide-react';
import { useUsersService, type UserCompany } from '../services/usersService';
import { useGroupsService, type Group } from '../services/groupsService';
import { useAuthStore } from '../store/auth';

import { Permission } from '../config/permissions';

export function ManageUsersPage() {
    const [users, setUsers] = useState<UserCompany[]>([]);
    const [groups, setGroups] = useState<Group[]>([]); // Groups state
    const { findAll, addUser, removeUser, updateUserGroup } = useUsersService(); // Updated service hook
    const { getAll: getAllGroups } = useGroupsService();
    const toast = useCustomToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user: currentUser, can } = useAuthStore();

    const [newUser, setNewUser] = useState({ name: '', email: '', groupId: 0, password: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [usersData, groupsData] = await Promise.all([
                findAll(),
                getAllGroups()
            ]);
            setUsers(usersData);
            setGroups(groupsData);

            // Set default group for new user
            if (groupsData.length > 0) {
                // Try to find Viewer or pick first
                const viewer = groupsData.find(g => g.name === 'Viewer') || groupsData[0];
                setNewUser(prev => ({ ...prev, groupId: viewer.id }));
            }
        } catch (error) {
            toast.error('Erro ao carregar dados');
        }
    }

    // Refresh users only
    async function loadUsers() {
        try {
            const data = await findAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleAddUser() {
        if (!newUser.name || !newUser.email || !newUser.groupId) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            setLoading(true);
            await addUser({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                groupId: Number(newUser.groupId)
            });
            toast.success('Usuário adicionado!');
            onClose();
            setNewUser(prev => ({ ...prev, name: '', email: '', password: '' })); // Keep groupId
            loadUsers();
        } catch (error) {
            toast.error('Erro ao adicionar usuário');
        } finally {
            setLoading(false);
        }
    }

    async function handleRemoveUser(id: number) {
        if (!window.confirm('Tem certeza que deseja remover este usuário da empresa?')) return;

        try {
            await removeUser(id);
            toast.success('Usuário removido');
            loadUsers();
        } catch (error) {
            toast.error('Erro ao remover usuário');
        }
    }

    async function handleGroupChange(userId: number, newGroupId: string) {
        try {
            await updateUserGroup(userId, Number(newGroupId));
            toast.success('Grupo atualizado');
            loadUsers();
        } catch (error) {
            toast.error('Erro ao atualizar grupo');
        }
    }

    return (
        <Box>
            <HStack justifyContent="space-between" mb={6}>
                <Heading size="lg">Gerenciar Usuários</Heading>
                {can(Permission.USER_INVITE) && (
                    <Button leftIcon={<UserPlus size={20} />} colorScheme="brand" onClick={onOpen}>
                        Adicionar Usuário
                    </Button>
                )}
            </HStack>

            <Box bg="white" p={5} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.100">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>Email</Th>
                            <Th>Grupo</Th>
                            <Th width="50px"></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((uc) => (
                            <Tr key={uc.userId}>
                                <Td fontWeight="medium">
                                    {uc.user.name}
                                    {uc.user.id === currentUser?.id && <Badge ml={2} colorScheme="green">Você</Badge>}
                                </Td>
                                <Td>{uc.user.email}</Td>
                                <Td>
                                    <Select
                                        size="sm"
                                        value={uc.group?.id || ''}
                                        onChange={(e) => handleGroupChange(uc.user.id, e.target.value)}
                                        isDisabled={uc.role === 'OWNER' || uc.user.id === currentUser?.id || !can(Permission.USER_EDIT)}
                                        width="150px"
                                    >
                                        {groups.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </Select>
                                </Td>
                                <Td>
                                    {can(Permission.USER_DELETE) && uc.role !== 'OWNER' && uc.user.id !== currentUser?.id && (
                                        <IconButton
                                            aria-label="Remover usuário"
                                            icon={<Trash2 size={18} />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleRemoveUser(uc.user.id)}
                                        />
                                    )}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal Adicionar Usuário */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicionar Usuário</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text fontSize="sm" color="gray.500" mb={4}>
                            O usuário será adicionado à sua empresa imediatamente.
                            Se o e-mail não existir, uma conta será criada com a senha padrão "123456".
                        </Text>

                        <FormControl isRequired>
                            <FormLabel>Nome</FormLabel>
                            <Input
                                placeholder="Nome completo"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="email@exemplo.com"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Senha (Opcional)</FormLabel>
                            <Input
                                type="password"
                                placeholder="Deixe em branco para senha padrão"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Grupo</FormLabel>
                            <Select
                                value={newUser.groupId}
                                onChange={(e) => setNewUser({ ...newUser, groupId: Number(e.target.value) })}
                            >
                                <option value={0} disabled>Selecione um grupo</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="brand" mr={3} onClick={handleAddUser} isLoading={loading}>
                            Salvar
                        </Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
