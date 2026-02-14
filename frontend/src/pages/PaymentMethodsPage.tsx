import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';
import { useCustomToast } from '../hooks/useCustomToast';
import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
} from '@chakra-ui/react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

interface PaymentMethod {
  id: number;
  name: string;
}

export function PaymentMethodsPage() {
  const api = useAuthApi();
  const toast = useCustomToast();
  const [items, setItems] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [newName, setNewName] = useState('');

  // Edit States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<PaymentMethod | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<PaymentMethod[]>('/payment-methods');
      setItems(data);
    } catch (e: any) {
      toast.error('Erro ao carregar formas de pagamento', e?.message);
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
      await api.post<PaymentMethod, any>('/payment-methods', { name: newName });
      setNewName('');
      await load();
      toast.success('Forma de pagamento criada!');
    } catch (e: any) {
      toast.error('Erro ao criar', e?.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta forma de pagamento?')) return;
    try {
      await api.del(`/payment-methods/${id}`);
      await load();
      toast.info('Excluído com sucesso');
    } catch (e: any) {
      toast.error('Erro ao excluir', e?.message);
    }
  }

  function openEditModal(item: PaymentMethod) {
    setEditingItem(item);
    onOpen();
  }

  async function handleUpdate() {
    if (!editingItem) return;
    try {
      await api.patch(`/payment-methods/${editingItem.id}`, {
        name: editingItem.name,
      });
      onClose();
      await load();
      toast.success('Atualizado com sucesso');
    } catch (e: any) {
      toast.error('Erro ao atualizar', e?.message);
    }
  }

  return (
    <Box>
      <Heading size="lg" mb="6">Formas de Pagamento</Heading>

      {/* Create Form */}
      <Box bg="white" p={6} borderRadius="2xl" shadow="sm" mb="8" border="1px" borderColor="gray.100">
        <Heading size="md" mb="4" color="gray.700">Nova Forma de Pagamento</Heading>
        <form onSubmit={handleCreate}>
          <Flex gap="4" align="flex-end">
            <FormControl flex={1}>
              <FormLabel fontSize="sm" color="gray.500">Nome</FormLabel>
              <Input
                required
                placeholder="Ex: Cartão de Crédito"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                bg="gray.50"
                border="none"
                _focus={{ bg: 'white', shadow: 'outline' }}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="brand"
              leftIcon={<Plus size={20} />}
              isLoading={loading}
              px={8}
            >
              Adicionar
            </Button>
          </Flex>
        </form>
      </Box>

      {/* List Table */}
      <Box bg="white" borderRadius="xl" shadow="sm" overflow="hidden">
        <TableContainer>
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Nome</Th>
                <Th textAlign="center">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((m) => (
                <Tr key={m.id}>
                  <Td fontWeight="medium">{m.name}</Td>
                  <Td textAlign="center">
                    <HStack justify="center" spacing={2}>
                      <IconButton
                        aria-label="Editar"
                        icon={<Edit2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => openEditModal(m)}
                      />
                      <IconButton
                        aria-label="Excluir"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(m.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {items.length === 0 && (
                <Tr>
                  <Td colSpan={2} textAlign="center" py={8} color="gray.500">
                    Nenhuma forma de pagamento cadastrada.
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
          <ModalHeader>Editar Forma de Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingItem && (
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                />
              </FormControl>
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
