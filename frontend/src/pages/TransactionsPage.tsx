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
  SimpleGrid,
  Text,
  Icon,
} from '@chakra-ui/react';
import { Plus, Filter, Trash2, Edit2, Check, Download, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import { Permission } from '../config/permissions';
import { useAuthStore } from '../store/auth';
import { saveAs } from 'file-saver';
import { AttachmentsModal } from '../components/AttachmentsModal';

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

interface Attachment {
  id: number;
  filename: string;
  size: number;
  mimetype: string;
  createdAt: string;
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
  attachments: Attachment[];
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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [file, setFile] = useState<File | null>(null);

  // Edit States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Attachments States
  const { isOpen: isAttachmentsOpen, onOpen: onAttachmentsOpen, onClose: onAttachmentsClose } = useDisclosure();
  const [selectedTransactionForAttachments, setSelectedTransactionForAttachments] = useState<Transaction | null>(null);

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

  async function loadTransactions(currentPage = page) {
    try {
      const params = new URLSearchParams();
      if (filterFrom) params.append('from', filterFrom);
      if (filterTo) params.append('to', filterTo);
      if (filterType !== 'ALL') params.append('type', filterType);

      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());

      const qs = params.toString();
      const response: any = await api.get(
        `/transactions${qs ? `?${qs}` : ''}`,
      );

      if (response.data && response.meta) {
        setTransactions(response.data);
        setTotal(response.meta.total);
      } else {
        // Fallback if backend not updated
        setTransactions(response);
        setTotal(response.length);
      }
    } catch (e: any) {
      toast.error('Erro ao carregar lançamentos.', e?.message);
    }
  }

  async function handleExport() {
    try {
      const params = new URLSearchParams();
      if (filterFrom) params.append('from', filterFrom);
      if (filterTo) params.append('to', filterTo);
      if (filterType !== 'ALL') params.append('type', filterType);

      const response = await api.get('/transactions/export?' + params.toString(), {
        responseType: 'blob'
      });

      saveAs(new Blob([response as any]), 'lancamentos.xlsx');
      toast.success('Download iniciado!');
    } catch (e: any) {
      toast.error('Erro ao exportar', e?.message);
    }
  }

  useEffect(() => {
    loadLookups();
    loadTransactions();
  }, [limit]); // Reload when limit changes

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response: any = await api.post<Transaction, any>('/transactions', {
        type,
        date,
        amount: Number(amount),
        categoryId: Number(categoryId),
        paymentMethodId: Number(paymentMethodId),
        description: description || undefined,
      });

      if (file && response?.id) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          // We use the same endpoint as the modal
          await api.post(`/uploads/transaction/${response.id}`, formData);
        } catch (uploadError) {
          console.error(uploadError);
          toast.warning('Lançamento criado, mas erro no anexo.');
        }
      }

      setAmount('');
      setDescription('');
      setFile(null);
      await loadTransactions(1);
      toast.success('Lançamento criado!');
    } catch (e: any) {
      toast.error('Erro ao criar lançamento.', e?.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Deseja excluir este lançamento?')) return;
    try {
      await api.del(`/transactions/${id}`);
      await loadTransactions(page);
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

  function openAttachmentsModal(t: Transaction) {
    setSelectedTransactionForAttachments(t);
    onAttachmentsOpen();
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
      await loadTransactions(page);
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
      <Box bg="white" p={6} borderRadius="2xl" shadow="sm" mb="8" border="1px" borderColor="gray.100">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md" color="gray.700">Novo Lançamento</Heading>
          <Badge colorScheme="brand" p={2} borderRadius="lg">Registro Rápido</Badge>
        </Flex>

        <form onSubmit={handleCreate}>
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
              <FormControl gridColumn={{ md: "span 3" }}>
                <FormLabel fontSize="sm" color="gray.500">Descrição</FormLabel>
                <Input
                  placeholder="Ex: Compra de mercadorias, Pagamento Salário..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', shadow: 'outline' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" color="gray.500">Valor</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', shadow: 'outline' }}
                  fontWeight="bold"
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.500">Tipo</FormLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', shadow: 'outline' }}
                >
                  <option value="INCOME">Entrada</option>
                  <option value="EXPENSE">Saída</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" color="gray.500">Data</FormLabel>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', shadow: 'outline' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" color="gray.500">Categoria</FormLabel>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="Selecione"
                  required
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', shadow: 'outline' }}
                >
                  {visibleCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" color="gray.500">Forma de Pag.</FormLabel>
                <Select
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  placeholder="Selecione"
                  required
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', shadow: 'outline' }}
                >
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontSize="sm" color="gray.500">Anexo (Opcional)</FormLabel>
              <Box
                position="relative"
                h="45px"
                borderRadius="md"
                border="1px dashed"
                borderColor={file ? "brand.500" : "gray.200"}
                bg={file ? "brand.50" : "gray.50"}
                _hover={{ borderColor: "brand.500", bg: "gray.100" }}
                display="flex"
                alignItems="center"
                px={4}
                transition="all 0.2s"
                cursor="pointer"
              >
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  cursor="pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  zIndex={2}
                />
                <Flex align="center" gap={3} width="100%">
                  <Icon as={Paperclip} boxSize={5} color={file ? "brand.500" : "gray.400"} />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight={file ? "medium" : "normal"} color={file ? "brand.700" : "gray.500"} isTruncated maxW="100%">
                      {file ? file.name : "Clique para anexar um comprovante ou documento"}
                    </Text>
                  </VStack>
                  {file && (
                    <IconButton
                      aria-label="Remover"
                      icon={<Trash2 size={16} />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      zIndex={3}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFile(null);
                        // Reset input value if needed
                      }}
                    />
                  )}
                </Flex>
              </Box>
            </FormControl>

            <Flex justify="flex-end">
              <Button
                type="submit"
                leftIcon={<Plus size={20} />}
                colorScheme="brand"
                size="lg"
                px={8}
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              >
                Adicionar Lançamento
              </Button>
            </Flex>
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
          <Button size="sm" onClick={() => { setPage(1); loadTransactions(1); }} leftIcon={<Filter size={14} />}>
            Filtrar
          </Button>
          <Button size="sm" onClick={handleExport} leftIcon={<Download size={14} />} colorScheme="green" variant="outline">
            Exportar Excel
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
                      <IconButton
                        aria-label="Anexos"
                        icon={
                          <HStack spacing={1}>
                            <Paperclip size={16} />
                            {t.attachments?.length > 0 && (
                              <Badge colorScheme="blue" fontSize="xx-small" borderRadius="full">
                                {t.attachments.length}
                              </Badge>
                            )}
                          </HStack>
                        }
                        size="sm"
                        variant="ghost"
                        colorScheme={t.attachments?.length > 0 ? "blue" : "gray"}
                        onClick={() => openAttachmentsModal(t)}
                      />
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

      {/* Pagination Controls */}
      <Flex justify="space-between" align="center" mt={4} px={2} direction={{ base: 'column', md: 'row' }} gap={4}>
        <HStack>
          <Text fontSize="sm" color="gray.600">
            Mostrando {transactions.length} de {total} registros
          </Text>
          <Select
            size="sm"
            maxW="80px"
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setLimit(newLimit);
              setPage(1);
            }}
            bg="white"
            borderRadius="md"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
          <Text fontSize="sm" color="gray.600">por página</Text>
        </HStack>

        <HStack>
          <Button
            size="sm"
            onClick={() => {
              const newPage = Math.max(1, page - 1);
              setPage(newPage);
              loadTransactions(newPage);
            }}
            isDisabled={page === 1}
            leftIcon={<ChevronLeft size={16} />}
            bg="white"
            boxShadow="sm"
          >
            Anterior
          </Button>
          <Text fontSize="sm" fontWeight="bold">
            Página {page} de {Math.max(1, Math.ceil(total / limit))}
          </Text>
          <Button
            size="sm"
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              loadTransactions(newPage);
            }}
            isDisabled={page * limit >= total}
            rightIcon={<ChevronRight size={16} />}
            bg="white"
            boxShadow="sm"
          >
            Próximo
          </Button>
        </HStack>
      </Flex>

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

      {/* Attachments Modal */}
      {selectedTransactionForAttachments && (
        <AttachmentsModal
          isOpen={isAttachmentsOpen}
          onClose={onAttachmentsClose}
          transactionId={selectedTransactionForAttachments.id}
          existingAttachments={selectedTransactionForAttachments.attachments}
          onUpdate={() => loadTransactions(page)}
        />
      )}
    </Box>
  );
}
