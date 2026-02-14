import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';
import { useCustomToast } from '../hooks/useCustomToast';
import {
  Box,
  Heading,
  Flex,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string | null;
}

export function CategoriesPage() {
  const api = useAuthApi();
  const toast = useCustomToast();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States (Create)
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [newColor, setNewColor] = useState('');

  // Edit States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<Category | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<Category[]>('/categories');
      setItems(data);
    } catch (e: any) {
      toast({
        title: 'Erro ao carregar categorias',
        description: e?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post<Category, any>('/categories', {
        name: newName,
        type: newType,
        color: newColor || undefined,
      });
      setNewName('');
      setNewColor('');
      await load();
      toast.success('Categoria criada!');
    } catch (e: any) {
      toast.error('Erro ao criar', e?.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await api.del(`/categories/${id}`);
      await load();
      toast.info('Categoria excluída');
    } catch (e: any) {
      toast.error('Erro ao excluir', e?.message);
    }
  }

  function openEditModal(item: Category) {
    setEditingItem(item);
    onOpen();
  }

  async function handleUpdate() {
    if (!editingItem) return;
    try {
      await api.patch(`/categories/${editingItem.id}`, {
        name: editingItem.name,
        type: editingItem.type,
        color: editingItem.color,
      });
      onClose();
      await load();
      toast({
        title: 'Categoria atualizada',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: 'Erro ao atualizar',
        description: e?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Box>
      <Heading size="lg" mb="6">Categorias</Heading>

      {/* Create Form */}
      <Box bg="white" p={6} borderRadius="2xl" shadow="sm" mb="8" border="1px" borderColor="gray.100">
        <Heading size="md" mb="4" color="gray.700">Nova Categoria</Heading>
        <form onSubmit={handleCreate}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} alignItems="flex-end">
            <FormControl gridColumn={{ md: "span 2" }}>
              <FormLabel fontSize="sm" color="gray.500">Nome</FormLabel>
              <Input
                required
                placeholder="Ex: Alimentação"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                bg="gray.50"
                border="none"
                _focus={{ bg: 'white', shadow: 'outline' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.500">Tipo</FormLabel>
              <Select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                bg="gray.50"
                border="none"
                _focus={{ bg: 'white', shadow: 'outline' }}
              >
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.500">Cor (Opcional)</FormLabel>
              <HStack>
                <Input
                  placeholder="#000000"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', shadow: 'outline' }}
                />
                {newColor && (
                  <Box w="10" h="10" borderRadius="md" bg={newColor} border="1px solid #e2e8f0" flexShrink={0} />
                )}
              </HStack>
            </FormControl>
            <Box gridColumn={{ base: "1", md: "4" }} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                colorScheme="brand"
                leftIcon={<Plus size={20} />}
                isLoading={loading}
                width="full"
              >
                Adicionar
              </Button>
            </Box>
          </SimpleGrid>
        </form>
      </Box>

      {/* List Table */}
      <Box bg="white" borderRadius="xl" shadow="sm" overflow="hidden">
        <TableContainer>
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Nome</Th>
                <Th>Tipo</Th>
                <Th>Cor</Th>
                <Th textAlign="center">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((c) => (
                <Tr key={c.id}>
                  <Td fontWeight="medium">{c.name}</Td>
                  <Td>
                    <Badge colorScheme={c.type === 'INCOME' ? 'green' : 'red'}>
                      {c.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </Td>
                  <Td>
                    {c.color && (
                      <Flex align="center" gap="2">
                        <Box w="4" h="4" borderRadius="full" bg={c.color} border="1px solid #e2e8f0" />
                        <Box as="span" fontSize="sm" color="gray.500">{c.color}</Box>
                      </Flex>
                    )}
                  </Td>
                  <Td textAlign="center">
                    <HStack justify="center" spacing={2}>
                      <IconButton
                        aria-label="Editar"
                        icon={<Edit2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => openEditModal(c)}
                      />
                      <IconButton
                        aria-label="Excluir"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(c.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {items.length === 0 && (
                <Tr>
                  <Td colSpan={4} textAlign="center" py={8} color="gray.500">
                    Nenhuma categoria cadastrada.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Categoria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingItem && (
              <Flex direction="column" gap="4">
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    value={editingItem.type}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        type: e.target.value as 'INCOME' | 'EXPENSE',
                      })
                    }
                  >
                    <option value="INCOME">Receita</option>
                    <option value="EXPENSE">Despesa</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Cor</FormLabel>
                  <Input
                    value={editingItem.color || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, color: e.target.value })
                    }
                  />
                </FormControl>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" onClick={handleUpdate} leftIcon={<Check size={18} />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
