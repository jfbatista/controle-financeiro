import { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    Heading,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Grid,
    GridItem,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAuthApi } from '../../services/authFetch';
import { useCustomToast } from '../../hooks/useCustomToast';

interface BalanceSheetData {
    date: string;
    assets: number;
    liabilities: number;
    equity: number;
}

export function BalanceSheetReport() {
    const api = useAuthApi();
    const toast = useCustomToast();
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [data, setData] = useState<BalanceSheetData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const res = await api.get<BalanceSheetData>(`/reports/balance-sheet?date=${date}`);
            setData(res);
        } catch (error: any) {
            toast.error('Erro ao carregar Balanço', error?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box animation="fadeIn 0.5s">
            <Flex gap="4" mb="6" align="flex-end" bg="gray.50" p="4" borderRadius="md">
                <FormControl maxW="300px">
                    <FormLabel>Posição em</FormLabel>
                    <Input type="date" bg="white" value={date} onChange={e => setDate(e.target.value)} />
                </FormControl>
                <Button colorScheme="brand" onClick={loadData} isLoading={loading}>
                    Atualizar
                </Button>
            </Flex>

            {data ? (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb="8">
                    <GridItem>
                        <Stat bg="green.50" p="4" borderRadius="md" border="1px" borderColor="green.100">
                            <StatLabel display="flex" alignItems="center" gap={2}>
                                <TrendingUp size={16} /> Ativo Total
                            </StatLabel>
                            <StatNumber color="green.600">
                                {data.assets.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </StatNumber>
                            <StatHelpText>Total de Receitas Acumuladas</StatHelpText>
                        </Stat>
                    </GridItem>
                    <GridItem>
                        <Stat bg="red.50" p="4" borderRadius="md" border="1px" borderColor="red.100">
                            <StatLabel display="flex" alignItems="center" gap={2}>
                                <TrendingDown size={16} /> Passivo Total
                            </StatLabel>
                            <StatNumber color="red.600">
                                {data.liabilities.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </StatNumber>
                            <StatHelpText>Total de Despesas Acumuladas</StatHelpText>
                        </Stat>
                    </GridItem>
                    <GridItem>
                        <Stat bg="blue.50" p="4" borderRadius="md" border="1px" borderColor="blue.100">
                            <StatLabel display="flex" alignItems="center" gap={2}>
                                <DollarSign size={16} /> Patrimônio Líquido
                            </StatLabel>
                            <StatNumber color="blue.600">
                                {data.equity.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </StatNumber>
                            <StatHelpText>Resultado Acumulado (Ativo - Passivo)</StatHelpText>
                        </Stat>
                    </GridItem>
                </Grid>
            ) : (
                <Text color="gray.500" textAlign="center" py={10}>Carregando dados...</Text>
            )}

            <Box mt={8}>
                <Heading size="md" mb={4}>Entenda o Cálculo</Heading>
                <Text fontSize="sm" color="gray.600">
                    O <strong>Balanço Patrimonial Simplificado</strong> apresenta a posição financeira acumulada da empresa até a data selecionada.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={2}>
                    <strong>Ativo Total:</strong> Soma de todas as receitas lançadas no sistema desde o início.<br />
                    <strong>Passivo Total:</strong> Soma de todas as despesas lançadas no sistema desde o início.<br />
                    <strong>Patrimônio Líquido:</strong> A diferença entre Ativos e Passivos, representando o lucro acumulado ou prejuízo.
                </Text>
            </Box>
        </Box>
    );
}
