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
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" mb={6} border="1px" borderColor="gray.100">
                <Flex gap="4" align="flex-end" wrap={{ base: 'wrap', md: 'nowrap' }}>
                    <FormControl maxW="300px">
                        <FormLabel fontSize="sm" color="gray.500">Posição em</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            bg="gray.50"
                            border="0"
                            _focus={{ bg: 'white', shadow: 'outline' }}
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        size="lg"
                        colorScheme="brand"
                        onClick={loadData}
                        isLoading={loading}
                        px={8}
                    >
                        Atualizar
                    </Button>
                </Flex>
            </Box>

            {data ? (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb="8">
                    <GridItem>
                        <Stat bg="white" p="6" borderRadius="xl" shadow="sm" borderLeft="4px" borderColor="green.400">
                            <StatLabel display="flex" alignItems="center" gap={2} color="gray.500" mb={1}>
                                <TrendingUp size={16} /> Ativo Total
                            </StatLabel>
                            <StatNumber fontSize="3xl" color="green.600">
                                {data.assets.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </StatNumber>
                            <StatHelpText>Total de Receitas Acumuladas</StatHelpText>
                        </Stat>
                    </GridItem>
                    <GridItem>
                        <Stat bg="white" p="6" borderRadius="xl" shadow="sm" borderLeft="4px" borderColor="red.400">
                            <StatLabel display="flex" alignItems="center" gap={2} color="gray.500" mb={1}>
                                <TrendingDown size={16} /> Passivo Total
                            </StatLabel>
                            <StatNumber fontSize="3xl" color="red.600">
                                {data.liabilities.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </StatNumber>
                            <StatHelpText>Total de Despesas Acumuladas</StatHelpText>
                        </Stat>
                    </GridItem>
                    <GridItem>
                        <Stat bg="white" p="6" borderRadius="xl" shadow="sm" borderLeft="4px" borderColor="blue.400">
                            <StatLabel display="flex" alignItems="center" gap={2} color="gray.500" mb={1}>
                                <DollarSign size={16} /> Patrimônio Líquido
                            </StatLabel>
                            <StatNumber fontSize="3xl" color="blue.600">
                                {data.equity.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </StatNumber>
                            <StatHelpText>Resultado Acumulado</StatHelpText>
                        </Stat>
                    </GridItem>
                </Grid>
            ) : (
                <Flex justify="center" align="center" h="200px" color="gray.400" bg="white" borderRadius="xl" shadow="sm">
                    <Text>Selecione uma data para carregar o balanço.</Text>
                </Flex>
            )}

            <Box mt={8} bg="blue.50" p={6} borderRadius="xl" border="1px" borderColor="blue.100">
                <Heading size="sm" mb={3} color="blue.700">Entenda o Cálculo</Heading>
                <Text fontSize="sm" color="blue.700">
                    O <strong>Balanço Patrimonial Simplificado</strong> apresenta a posição financeira acumulada da empresa até a data selecionada.
                </Text>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mt={3}>
                    <Box>
                        <Text fontWeight="bold" fontSize="xs" color="blue.800" textTransform="uppercase">Ativo Total</Text>
                        <Text fontSize="sm" color="blue.600">Soma de todas as receitas desde o início.</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" fontSize="xs" color="blue.800" textTransform="uppercase">Passivo Total</Text>
                        <Text fontSize="sm" color="blue.600">Soma de todas as despesas desde o início.</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" fontSize="xs" color="blue.800" textTransform="uppercase">Patrimônio Líquido</Text>
                        <Text fontSize="sm" color="blue.600">Lucro ou Prejuízo acumulado (Ativo - Passivo).</Text>
                    </Box>
                </Grid>
            </Box>
        </Box>
    );
}
