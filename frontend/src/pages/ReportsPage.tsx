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
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react';
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
        <Box>
            <Heading size="lg" mb="6">Relatórios Avançados</Heading>

            <Tabs variant="enclosed" colorScheme="brand" bg="white" p="4" borderRadius="lg" shadow="sm">
                <TabList>
                    <Tab><FileText size={18} style={{ marginRight: 8 }} /> DRE (Demonstrativo)</Tab>
                    <Tab>Fluxo de Caixa</Tab>
                    <Tab>Balanço Patrimonial</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        {/* DRE Controls */}
                        <Flex gap="4" mb="6" align="flex-end" bg="gray.50" p="4" borderRadius="md">
                            <FormControl>
                                <FormLabel>De</FormLabel>
                                <Input type="date" bg="white" value={dreFrom} onChange={e => setDreFrom(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Até</FormLabel>
                                <Input type="date" bg="white" value={dreTo} onChange={e => setDreTo(e.target.value)} />
                            </FormControl>
                            <Button colorScheme="brand" onClick={loadDRE} isLoading={loading}>
                                Gerar Relatório
                            </Button>
                        </Flex>

                        {dreData && (
                            <Box animation="fadeIn 0.5s">
                                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb="8">
                                    <GridItem>
                                        <Stat bg="green.50" p="4" borderRadius="md" border="1px" borderColor="green.100">
                                            <StatLabel>Total Receitas</StatLabel>
                                            <StatNumber color="green.600">
                                                {dreData.incomes.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </StatNumber>
                                            <StatHelpText><TrendingUp size={14} style={{ display: 'inline' }} /> Receita Operacional</StatHelpText>
                                        </Stat>
                                    </GridItem>
                                    <GridItem>
                                        <Stat bg="red.50" p="4" borderRadius="md" border="1px" borderColor="red.100">
                                            <StatLabel>Total Despesas</StatLabel>
                                            <StatNumber color="red.600">
                                                {dreData.expenses.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </StatNumber>
                                            <StatHelpText><TrendingDown size={14} style={{ display: 'inline' }} /> Custos e Despesas</StatHelpText>
                                        </Stat>
                                    </GridItem>
                                    <GridItem>
                                        <Stat bg={dreData.result >= 0 ? "blue.50" : "orange.50"} p="4" borderRadius="md" border="1px" borderColor={dreData.result >= 0 ? "blue.100" : "orange.100"}>
                                            <StatLabel>Resultado Líquido</StatLabel>
                                            <StatNumber color={dreData.result >= 0 ? "blue.600" : "orange.600"}>
                                                {dreData.result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </StatNumber>
                                            <StatHelpText>Margem: {dreData.profitMargin.toFixed(2)}%</StatHelpText>
                                        </Stat>
                                    </GridItem>
                                </Grid>

                                <Flex justify="flex-end" mb="4">
                                    <Button leftIcon={<Download size={18} />} colorScheme="red" variant="outline" onClick={exportPDF}>
                                        Exportar PDF
                                    </Button>
                                </Flex>

                                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                                    {/* Incomes Table */}
                                    <Box>
                                        <Heading size="sm" mb="3" color="green.600">Detalhamento de Receitas</Heading>
                                        <TableContainer border="1px" borderColor="gray.200" borderRadius="md">
                                            <Table size="sm">
                                                <Thead bg="gray.50">
                                                    <Tr>
                                                        <Th>Categoria</Th>
                                                        <Th isNumeric>Valor</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {dreData.incomes.breakdown.map((item, idx) => (
                                                        <Tr key={idx}>
                                                            <Td>{item.category}</Td>
                                                            <Td isNumeric>{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Td>
                                                        </Tr>
                                                    ))}
                                                    <Tr fontWeight="bold" bg="gray.50">
                                                        <Td>TOTAL</Td>
                                                        <Td isNumeric>{dreData.incomes.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Td>
                                                    </Tr>
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </Box>

                                    {/* Expenses Table */}
                                    <Box>
                                        <Heading size="sm" mb="3" color="red.600">Detalhamento de Despesas</Heading>
                                        <TableContainer border="1px" borderColor="gray.200" borderRadius="md">
                                            <Table size="sm">
                                                <Thead bg="gray.50">
                                                    <Tr>
                                                        <Th>Categoria</Th>
                                                        <Th isNumeric>Valor</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {dreData.expenses.breakdown.map((item, idx) => (
                                                        <Tr key={idx}>
                                                            <Td>{item.category}</Td>
                                                            <Td isNumeric>{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Td>
                                                        </Tr>
                                                    ))}
                                                    <Tr fontWeight="bold" bg="gray.50">
                                                        <Td>TOTAL</Td>
                                                        <Td isNumeric>{dreData.expenses.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Td>
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
