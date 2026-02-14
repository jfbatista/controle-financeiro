import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Grid,
    GridItem,
    Divider,
} from '@chakra-ui/react';
import { Download, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAuthApi } from '../services/authFetch';
import { useCustomToast } from '../hooks/useCustomToast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { CashFlowChart } from '../components/charts/CashFlowChart';
import { BalanceSheetReport } from '../components/reports/BalanceSheetReport';

interface DREData {
    period: { from: string; to: string };
    incomes: {
        total: number;
        breakdown: { category: string; amount: number }[];
    };
    expenses: {
        total: number;
        breakdown: { category: string; amount: number }[];
    };
    result: number;
    profitMargin: number;
}

export function ReportsPage() {
    const api = useAuthApi();
    const toast = useCustomToast();

    // DRE State
    const [dreFrom, setDreFrom] = useState(() => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().slice(0, 10);
    });
    const [dreTo, setDreTo] = useState(() => new Date().toISOString().slice(0, 10));
    const [dreData, setDreData] = useState<DREData | null>(null);
    const [loading, setLoading] = useState(false);

    async function loadDRE() {
        setLoading(true);
        try {
            const data = await api.get<DREData>(`/reports/dre?from=${dreFrom}&to=${dreTo}`);
            setDreData(data);
        } catch (e: any) {
            toast.error('Erro ao carregar DRE', e?.message);
        } finally {
            setLoading(false);
        }
    }

    function exportPDF() {
        if (!dreData) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text('Demonstrativo de Resultados (DRE)', 14, 22);

        doc.setFontSize(11);
        doc.text(`Período: ${format(new Date(dreData.period.from), 'dd/MM/yyyy')} a ${format(new Date(dreData.period.to), 'dd/MM/yyyy')}`, 14, 32);

        let finalY = 40;

        // Incomes
        doc.setFontSize(14);
        doc.text('Receitas', 14, finalY);
        finalY += 5;

        autoTable(doc, {
            startY: finalY,
            head: [['Categoria', 'Valor']],
            body: [
                ...dreData.incomes.breakdown.map(item => [item.category, `R$ ${item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]),
                ['TOTAL RECEITAS', `R$ ${dreData.incomes.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ],
            headStyles: { fillColor: [40, 167, 69] },
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        });

        finalY = (doc as any).lastAutoTable.finalY + 15;

        // Expenses
        doc.text('Despesas', 14, finalY);
        finalY += 5;

        autoTable(doc, {
            startY: finalY,
            head: [['Categoria', 'Valor']],
            body: [
                ...dreData.expenses.breakdown.map(item => [item.category, `R$ ${item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]),
                ['TOTAL DESPESAS', `R$ ${dreData.expenses.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ],
            headStyles: { fillColor: [220, 53, 69] },
        });

        finalY = (doc as any).lastAutoTable.finalY + 15;

        // Result
        doc.setFontSize(14);
        doc.text(`Resultado Líquido: R$ ${dreData.result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, finalY);

        doc.setFontSize(12);
        doc.text(`Margem de Lucro: ${dreData.profitMargin.toFixed(2)}%`, 14, finalY + 8);

        doc.save('relatorio_dre.pdf');
        toast.success('PDF gerado com sucesso!');
    }

    return (
        <Box maxW="container.xl" mx="auto" pb={10}>
            <Tabs variant="soft-rounded" colorScheme="brand" isLazy>
                <TabList mb={6} bg="white" p={2} borderRadius="full" shadow="sm" display="inline-flex">
                    <Tab _selected={{ bg: 'brand.500', color: 'white', shadow: 'md' }}>
                        <Flex align="center" gap={2}><FileText size={18} /> DRE</Flex>
                    </Tab>
                    <Tab _selected={{ bg: 'brand.500', color: 'white', shadow: 'md' }}>
                        <Flex align="center" gap={2}><TrendingUp size={18} /> Fluxo de Caixa</Flex>
                    </Tab>
                    <Tab _selected={{ bg: 'brand.500', color: 'white', shadow: 'md' }}>
                        <Flex align="center" gap={2}><DollarSign size={18} /> Balanço</Flex>
                    </Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px={0}>
                        {/* DRE Controls */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm" mb={6} border="1px" borderColor="gray.100">
                            <Flex gap="4" align="flex-end" wrap={{ base: 'wrap', md: 'nowrap' }}>
                                <FormControl>
                                    <FormLabel fontSize="sm" color="gray.500">Período De</FormLabel>
                                    <Input
                                        type="date"
                                        size="lg"
                                        bg="gray.50"
                                        border="0"
                                        _focus={{ bg: 'white', shadow: 'outline' }}
                                        value={dreFrom}
                                        onChange={e => setDreFrom(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="sm" color="gray.500">Até</FormLabel>
                                    <Input
                                        type="date"
                                        size="lg"
                                        bg="gray.50"
                                        border="0"
                                        _focus={{ bg: 'white', shadow: 'outline' }}
                                        value={dreTo}
                                        onChange={e => setDreTo(e.target.value)}
                                    />
                                </FormControl>
                                <Button
                                    size="lg"
                                    colorScheme="brand"
                                    onClick={loadDRE}
                                    isLoading={loading}
                                    px={8}
                                    leftIcon={<FileText size={20} />}
                                >
                                    DRE
                                </Button>
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={exportPDF}
                                    isDisabled={!dreData}
                                    leftIcon={<Download size={20} />}
                                >
                                    PDF
                                </Button>
                            </Flex>
                        </Box>

                        {dreData && (
                            <Box animation="fadeIn 0.5s">
                                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb="8">
                                    <GridItem>
                                        <Stat bg="white" p="6" borderRadius="xl" shadow="sm" borderLeft="4px" borderColor="green.400">
                                            <StatLabel color="gray.500" mb={1}>Total Receitas</StatLabel>
                                            <StatNumber fontSize="2xl" color="green.600">
                                                {dreData.incomes.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </StatNumber>
                                            <StatHelpText display="flex" alignItems="center" gap={1}>
                                                <Box as={TrendingUp} size={14} color="green.500" />
                                                <Text fontSize="xs">Faturamento Bruto</Text>
                                            </StatHelpText>
                                        </Stat>
                                    </GridItem>
                                    <GridItem>
                                        <Stat bg="white" p="6" borderRadius="xl" shadow="sm" borderLeft="4px" borderColor="red.400">
                                            <StatLabel color="gray.500" mb={1}>Total Despesas</StatLabel>
                                            <StatNumber fontSize="2xl" color="red.600">
                                                {dreData.expenses.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </StatNumber>
                                            <StatHelpText display="flex" alignItems="center" gap={1}>
                                                <Box as={TrendingDown} size={14} color="red.500" />
                                                <Text fontSize="xs">Custos Operacionais</Text>
                                            </StatHelpText>
                                        </Stat>
                                    </GridItem>
                                    <GridItem>
                                        <Stat bg="white" p="6" borderRadius="xl" shadow="sm" borderLeft="4px" borderColor={dreData.result >= 0 ? "blue.400" : "orange.400"}>
                                            <StatLabel color="gray.500" mb={1}>Resultado Líquido</StatLabel>
                                            <StatNumber fontSize="2xl" color={dreData.result >= 0 ? "blue.600" : "orange.600"}>
                                                {dreData.result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </StatNumber>
                                            <StatHelpText>Margem de Lucro: <b>{dreData.profitMargin.toFixed(2)}%</b></StatHelpText>
                                        </Stat>
                                    </GridItem>
                                </Grid>

                                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                                    {/* Incomes Table */}
                                    <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
                                        <Heading size="sm" mb="4" color="green.600" display="flex" alignItems="center" gap={2}>
                                            <Box as={TrendingUp} size={16} /> Detalhamento de Receitas
                                        </Heading>
                                        <TableContainer>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th color="gray.500">Categoria</Th>
                                                        <Th isNumeric color="gray.500">Valor</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {dreData.incomes.breakdown.map((item, idx) => (
                                                        <Tr key={idx} _hover={{ bg: 'gray.50' }}>
                                                            <Td fontWeight="medium">{item.category}</Td>
                                                            <Td isNumeric color="gray.700">
                                                                {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                    <Tr bg="green.50" fontWeight="bold">
                                                        <Td color="green.800">TOTAL</Td>
                                                        <Td isNumeric color="green.800">
                                                            {dreData.incomes.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </Td>
                                                    </Tr>
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </Box>

                                    {/* Expenses Table */}
                                    <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
                                        <Heading size="sm" mb="4" color="red.600" display="flex" alignItems="center" gap={2}>
                                            <Box as={TrendingDown} size={16} /> Detalhamento de Despesas
                                        </Heading>
                                        <TableContainer>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th color="gray.500">Categoria</Th>
                                                        <Th isNumeric color="gray.500">Valor</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {dreData.expenses.breakdown.map((item, idx) => (
                                                        <Tr key={idx} _hover={{ bg: 'gray.50' }}>
                                                            <Td fontWeight="medium">{item.category}</Td>
                                                            <Td isNumeric color="gray.700">
                                                                {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                    <Tr bg="red.50" fontWeight="bold">
                                                        <Td color="red.800">TOTAL</Td>
                                                        <Td isNumeric color="red.800">
                                                            {dreData.expenses.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </Td>
                                                    </Tr>
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Grid>
                            </Box>
                        )}

                        {!dreData && !loading && (
                            <Flex justify="center" align="center" h="200px" color="gray.400">
                                <Text>Selecione um período e clique em "Gerar Relatório" para visualizar a DRE.</Text>
                            </Flex>
                        )}
                    </TabPanel>
                    <TabPanel>
                        <CashFlowChart api={api} toast={toast} />
                    </TabPanel>
                    <TabPanel>
                        <BalanceSheetReport />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}
