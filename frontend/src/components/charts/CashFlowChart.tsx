import { useState, useEffect } from 'react';
import { Box, Flex, Select, Heading } from '@chakra-ui/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

interface CashFlowData {
    month: string;
    income: number;
    expenses: number;
    net: number;
}

export function CashFlowChart({ api, toast }: { api: any, toast: any }) {
    const [data, setData] = useState<CashFlowData[]>([]);
    const [months, setMonths] = useState('6');

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get(`/reports/cash-flow?months=${months}`);
                setData(res);
            } catch (e: any) {
                toast.error('Erro ao carregar fluxo de caixa', e?.message);
            }
        }
        load();
    }, [months]);

    return (
        <Box>
            <Flex justify="space-between" align="center" mb="6">
                <Heading size="md" color="gray.700">Evolução do Caixa</Heading>
                <Select w="200px" value={months} onChange={(e) => setMonths(e.target.value)}>
                    <option value="6">Últimos 6 meses</option>
                    <option value="12">Últimos 12 meses</option>
                    <option value="24">Últimos 24 meses</option>
                </Select>
            </Flex>

            <Box h="400px" w="100%">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                            formatter={(value?: number) => (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        />
                        <Legend />
                        <ReferenceLine y={0} stroke="#000" />
                        <Bar dataKey="income" name="Receitas" fill="#48BB78" />
                        <Bar dataKey="expenses" name="Despesas" fill="#F56565" />
                        <Bar dataKey="net" name="Saldo Líquido" fill="#4299E1" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}
