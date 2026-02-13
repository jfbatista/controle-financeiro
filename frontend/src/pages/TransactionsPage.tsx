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
  VStack,
  FormControl,
  FormLabel,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Plus, Filter, Trash2, Edit2, Check } from 'lucide-react';
import { Permission } from '../config/permissions';
import { useAuthStore } from '../store/auth';

type TransactionType = 'INCOME' | 'EXPENSE';

interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  type: TransactionType;
  date: string;
  amount: number;
  description?: string | null;
  category: Category;
  paymentMethod: PaymentMethod;
  categoryId: number;
  paymentMethodId: number;
}

export function TransactionsPage() {
  const api = useAuthApi();
  const toast = useCustomToast();
  const can = useAuthStore((state) => state.can);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  // Create/Filter States
  const [type, setType] = useState<TransactionType>('INCOME');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [description, setDescription] = useState('');

  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  // Edit States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<any | null>(null);

  async function loadLookups() {
    try {
      const [cats, pms] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<PaymentMethod[]>('/payment-methods'),
      ]);
      setCategories(cats);
      setMethods(pms);
    } catch (e: any) {
      toast.error('Erro ao carregar dados.', e?.message);
    }
  }

  async function loadTransactions() {
    try {
      const params = new URLSearchParams();
      if (filterFrom) params.append('from', filterFrom);
      if (filterTo) params.append('to', filterTo);
      if (filterType !== 'ALL') params.append('type', filterType);
      const qs = params.toString();
      const data = await api.get<Transaction[]>(
        `/transactions${qs ? `?${qs}` : ''}`,
      );
      setTransactions(data);
    } catch (e: any) {
      toast.error('Erro ao carregar lançamentos.', e?.message);
    }
  }

  useEffect(() => {
    loadLookups();
    loadTransactions();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post<Transaction, any>('/transactions', {
        type,
        date,
        amount: Number(amount),
        categoryId: Number(categoryId),
        paymentMethodId: Number(paymentMethodId),
        description: description || undefined,
      });
      setAmount('');
      setDescription('');
      await loadTransactions();
      toast.success('Lançamento criado!');
    } catch (e: any) {
      toast.error('Erro ao criar lançamento.', e?.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Deseja excluir este lançamento?')) return;
    try {
      await api.del(`/transactions/${id}`);
      await loadTransactions();
      toast.info('Excluído');
    } catch (e: any) {
      toast.error('Erro ao excluir', e?.message);
    }
  }

  function openEditModal(t: Transaction) {
    setEditingItem({
      id: t.id,
      type: t.type,
      date: new Date(t.date).toISOString().slice(0, 10),
      amount: t.amount,
      categoryId: t.category?.id || '',
      paymentMethodId: t.paymentMethod?.id || '',
      description: t.description || '',
    });
    onOpen();
  }

  async function handleUpdate() {
    if (!editingItem) return;
    try {
      await api.patch(`/transactions/${editingItem.id}`, {
        type: editingItem.type,
        date: new Date(editingItem.date).toISOString(),
        amount: Number(editingItem.amount),
        categoryId: Number(editingItem.categoryId),
        paymentMethodId: Number(editingItem.paymentMethodId),
        description: editingItem.description,
      });
      onClose();
      await loadTransactions();
      toast.success('Atualizado!');
    } catch (e: any) {
      toast.error('Erro ao atualizar', e?.message);
    }
  }

  const incomeCategories = categories.filter((c) => c.type === 'INCOME');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  // Helper for visible categories in Create Form
  const visibleCategories = type === 'INCOME' ? incomeCategories : expenseCategories;

  // Helper for visible categories in Edit Modal
  const editVisibleCategories = editingItem?.type === 'INCOME' ? incomeCategories : expenseCategories;

  return (
    <Box>
      <Heading size="lg" mb="6">Lançamentos</Heading>

      {/* New Transaction Form */}
      <Box bg="white" p="6" borderRadius="xl" shadow="sm" mb="8">
        <Heading size="md" mb="4">Novo Lançamento</Heading>
        <form onSubmit={handleCreate}>
          <VStack spacing={4} align="stretch">
            <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
              <FormControl>
                <FormLabel>Tipo</FormLabel>
                <Select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
                  <option value="INCOME">Entrada</option>
                  <option value="EXPENSE">Saída</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Data</FormLabel>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Valor</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </FormControl>
            </Flex>

            <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
              <FormControl>
                <FormLabel>Categoria</FormLabel>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="Selecione"
                  required
                >
                  {visibleCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  placeholder="Selecione"
                  required
                >
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl flex={2}>
                <FormLabel>Descrição</FormLabel>
                <Input
                  placeholder="Descrição opcional"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </Flex>

            <Button type="submit" leftIcon={<Plus size={18} />} colorScheme="brand" alignSelf="flex-end">
              Adicionar
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Filters */}
      <Box mb="6" bg="gray.50" p="4" borderRadius="lg">
        <Flex gap="4" align="flex-end" wrap="wrap">
          <Box>
            <FormLabel fontSize="sm">De</FormLabel>
            <Input
              type="date"
              bg="white"
              size="sm"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </Box>
          <Box>
            <FormLabel fontSize="sm">Até</FormLabel>
            <Input
              type="date"
              bg="white"
              size="sm"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </Box>
          <Box minW="150px">
            <FormLabel fontSize="sm">Tipo</FormLabel>
            <Select
              bg="white"
              size="sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="ALL">Todos</option>
              <option value="INCOME">Entradas</option>
              <option value="EXPENSE">Saídas</option>
            </Select>
          </Box>
          <Button size="sm" onClick={loadTransactions} leftIcon={<Filter size={14} />}>
            Filtrar
          </Button>
        </Flex>
      </Box>

      {/* Transactions Table */}
      <Box bg="white" borderRadius="xl" shadow="sm" overflow="hidden">
        <TableContainer>
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Data</Th>
                <Th>Tipo</Th>
                <Th>Categoria</Th>
                <Th>Forma Pag.</Th>
                <Th isNumeric>Valor</Th>
                <Th>Descrição</Th>
                <Th textAlign="center">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((t) => (
                <Tr key={t.id} _hover={{ bg: 'gray.50' }}>
                  <Td>{new Date(t.date).toLocaleDateString('pt-BR')}</Td>
                  <Td>
                    <Badge colorScheme={t.type === 'INCOME' ? 'green' : 'red'}>
                      {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </Td>
                  <Td>{t.category?.name}</Td>
                  <Td>{t.paymentMethod?.name}</Td>
                  <Td isNumeric fontWeight="bold" color={t.type === 'INCOME' ? 'green.600' : 'red.600'}>
                    {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Td>
                  <Td color="gray.600" fontSize="sm">{t.description}</Td>
                  <Td textAlign="center">
                    <HStack justify="center" spacing={2}>
                      {can(Permission.TRANSACTION_EDIT) && (
                        <IconButton
                          aria-label="Editar"
                          icon={<Edit2 size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => openEditModal(t)}
                        />
                      )}
                      {can(Permission.TRANSACTION_DELETE) && (
                        <IconButton
                          aria-label="Excluir"
                          icon={<Trash2 size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(t.id)}
                        />
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {transactions.length === 0 && (
                <Tr>
                  <Td colSpan={7} textAlign="center" py="8" color="gray.500">
                    Nenhum lançamento encontrado.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Lançamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingItem && (
              <VStack spacing={4}>
                <Flex gap="4" w="100%">
                  <FormControl>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      value={editingItem.type}
                      onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                    >
                      <option value="INCOME">Entrada</option>
                      <option value="EXPENSE">Saída</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Data</FormLabel>
                    <Input
                      type="date"
                      value={editingItem.date}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    />
                  </FormControl>
                </Flex>

                <Flex gap="4" w="100%">
                  <FormControl>
                    <FormLabel>Valor</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingItem.amount}
                      onChange={(e) => setEditingItem({ ...editingItem, amount: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      value={editingItem.categoryId}
                      onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                    >
                      {editVisibleCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Flex>

                <FormControl>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select
                    value={editingItem.paymentMethodId}
                    onChange={(e) => setEditingItem({ ...editingItem, paymentMethodId: e.target.value })}
                  >
                    {methods.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Input
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleUpdate} leftIcon={<Check size={18} />}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
