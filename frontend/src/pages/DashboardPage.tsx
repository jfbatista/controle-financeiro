import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Skeleton,
  Icon,
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardData {
  totalIncomes: number;
  totalExpenses: number;
  netResult: number;
  history: {
    date: string;
    income: number;
    expense: number;
  }[];
  expensesByCategory: {
    categoryId: number;
    categoryName: string;
    color?: string;
    total: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function DashboardPage() {
  const api = useAuthApi();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await api.get<DashboardData>('/reports/dashboard');
        setData(result);
      } catch (e: any) {
        alert(`Erro ao carregar dashboard: ${e?.message || ''}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const netColor = (data?.netResult || 0) >= 0 ? 'green.500' : 'red.500';

  if (loading) {
    return (
      <Box>
        <Skeleton height="40px" mb="4" />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb="8">
          <Skeleton height="120px" />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </SimpleGrid>
        <Skeleton height="300px" />
      </Box>
    )
  }

  return (
    <Box pb="8">
      <Box mb="6">
        <Heading size="lg" mb="2">Dashboard</Heading>
        <Text color="gray.500">Visão geral do fluxo de caixa e performance financeira.</Text>
      </Box>

      {data && (
        <>
          {/* KPI Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb="8">
            <Card borderLeft="4px solid" borderLeftColor="brand.500">
              <CardBody>
                <Stat>
                  <Flex alignItems="center" mb="2">
                    <Icon as={TrendingUp} color="brand.500" mr="2" />
                    <StatLabel color="gray.500">Total Entradas</StatLabel>
                  </Flex>
                  <StatNumber color="brand.600">
                    {data.totalIncomes.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card borderLeft="4px solid" borderLeftColor="red.500">
              <CardBody>
                <Stat>
                  <Flex alignItems="center" mb="2">
                    <Icon as={TrendingDown} color="red.500" mr="2" />
                    <StatLabel color="gray.500">Total Saídas</StatLabel>
                  </Flex>
                  <StatNumber color="red.600">
                    {data.totalExpenses.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card borderLeft="4px solid" borderLeftColor={netColor}>
              <CardBody>
                <Stat>
                  <Flex alignItems="center" mb="2">
                    <Icon as={DollarSign} color={netColor} mr="2" />
                    <StatLabel color="gray.500">Resultado</StatLabel>
                  </Flex>
                  <StatNumber color={netColor}>
                    {data.netResult.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Charts Row */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>

            {/* Bar Chart: Income vs Expense History */}
            <Box gridColumn={{ lg: 'span 2' }} bg="white" p="6" borderRadius="xl" shadow="sm">
              <Heading size="md" mb="6">Evolução Diária</Heading>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.history}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      fontSize={12}
                    />
                    <YAxis
                      fontSize={12}
                      tickFormatter={(val) => `R$ ${val}`}
                    />
                    <Tooltip
                      formatter={(value: any) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Bar name="Receitas" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name="Despesas" dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Pie Chart: Expenses Categories */}
            <Box bg="white" p="6" borderRadius="xl" shadow="sm">
              <Heading size="md" mb="6">Despesas por Categoria</Heading>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="total"
                      nameKey="categoryName"
                    >
                      {data.expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>

          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
