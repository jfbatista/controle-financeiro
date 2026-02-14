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
    Text,
    SimpleGrid,
} from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';

type TransactionType = 'INCOME' | 'EXPENSE';

interface Category {
    id: number;
    name: string;
    type: TransactionType;
}

interface RecurringBill {
    id: number;
    type: TransactionType;
    dueDay: number;
    amountExpected: number;
    description?: string | null;
    category: Category;
    isActive: boolean;
}

export function RecurringBillsPage() {
    const api = useAuthApi();
    const toast = useCustomToast();
    const [bills, setBills] = useState<RecurringBill[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [type, setType] = useState<TransactionType>('EXPENSE');
    const [dueDay, setDueDay] = useState('');
    const [amountExpected, setAmountExpected] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');

    async function loadLookups() {
        try {
            const cats = await api.get<Category[]>('/categories');
            setCategories(cats);
        } catch (e: any) {
            toast.error('Erro ao carregar categorias.', e?.message);
        }
    }

    async function loadBills() {
        try {
            const data = await api.get<RecurringBill[]>('/recurring-bills');
            setBills(data);
        } catch (e: any) {
            toast.error('Erro ao carregar contas.', e?.message);
        }
    }

    useEffect(() => {
        loadLookups();
        loadBills();
    }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/recurring-bills', {
                type,
                dueDay: Number(dueDay),
                amountExpected: Number(amountExpected),
                categoryId: Number(categoryId),
                description: description || undefined,
            });
            setAmountExpected('');
            setDescription('');
            setDueDay('');
            await loadBills();
            toast.success('Conta fixa criada!');
        } catch (e: any) {
            toast.error('Erro ao criar conta.', e?.message);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Deseja realmente excluir esta conta fixa?')) return;
        try {
            await api.del(`/recurring-bills/${id}`);
            await loadBills();
            toast.info('Conta excluída.');
        } catch (e: any) {
            toast.error('Erro ao excluir.', e?.message);
        }
    }

    const incomeCategories = categories.filter((c) => c.type === 'INCOME');
    const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');
    const visibleCategories =
        type === 'INCOME' ? incomeCategories : expenseCategories;

    return (
        <Box>
            <Heading size="lg" mb="6">Contas Fixas (Recorrentes)</Heading>
            <Text color="gray.500" mb="6">Cadastre aqui suas contas que se repetem todo mês (Aluguel, Internet, etc).</Text>

            {/* Form */}
            <Box bg="white" p={6} borderRadius="2xl" shadow="sm" mb="8" border="1px" borderColor="gray.100">
                <Heading size="md" mb="4">Nova Conta Fixa</Heading>
                <form onSubmit={handleCreate}>
                    <VStack spacing={5} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
                            <FormControl gridColumn={{ md: "span 3" }}>
                                <FormLabel fontSize="sm" color="gray.500">Descrição</FormLabel>
                                <Input
                                    placeholder="Ex: Aluguel Loja Centro, Conta de Luz, Internet Fibra, etc."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm" color="gray.500">Valor Estimado</FormLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={amountExpected}
                                    onChange={(e) => setAmountExpected(e.target.value)}
                                    required
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                    fontWeight="bold"
                                />
                            </FormControl>
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
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
                                <FormLabel fontSize="sm" color="gray.500">Tipo</FormLabel>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as TransactionType)}
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                >
                                    <option value="EXPENSE">Saída</option>
                                    <option value="INCOME">Entrada</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="sm" color="gray.500">Dia do Vencimento</FormLabel>
                                <Input
                                    type="number"
                                    min="1" max="31"
                                    placeholder="Dia (1-31)"
                                    value={dueDay}
                                    onChange={(e) => setDueDay(e.target.value)}
                                    required
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: 'white', shadow: 'outline' }}
                                />
                            </FormControl>
                        </SimpleGrid>

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
                                Salvar Conta
                            </Button>
                        </Flex>
                    </VStack>
                </form>
            </Box>

            {/* Table */}
            < Box bg="white" borderRadius="xl" shadow="sm" overflow="hidden" >
                <TableContainer>
                    <Table variant="simple">
                        <Thead bg="gray.50">
                            <Tr>
                                <Th>Dia</Th>
                                <Th>Tipo</Th>
                                <Th>Categoria</Th>
                                <Th isNumeric>Valor Est.</Th>
                                <Th>Descrição</Th>
                                <Th textAlign="center">Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bills.map((b) => (
                                <Tr key={b.id} _hover={{ bg: 'gray.50' }}>
                                    <Td>{b.dueDay}</Td>
                                    <Td>
                                        <Badge colorScheme={b.type === 'INCOME' ? 'green' : 'red'}>
                                            {b.type === 'INCOME' ? 'Entrada' : 'Saída'}
                                        </Badge>
                                    </Td>
                                    <Td>{b.category?.name}</Td>
                                    <Td isNumeric fontWeight="bold" color={b.type === 'INCOME' ? 'green.600' : 'red.600'}>
                                        {Number(b.amountExpected).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Td>
                                    <Td>{b.description}</Td>
                                    <Td textAlign="center">
                                        <IconButton
                                            aria-label="Excluir"
                                            icon={<Trash2 size={16} />}
                                            colorScheme="red"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(b.id)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                            {bills.length === 0 && (
                                <Tr>
                                    <Td colSpan={6} textAlign="center" py="8" color="gray.500">
                                        Nenhuma conta recorrente cadastrada.
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box >
        </Box >
    );
}
