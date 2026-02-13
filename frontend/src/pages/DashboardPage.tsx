import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';
import { useCustomToast } from '../hooks/useCustomToast';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  StatHelpText,
  StatArrow,
  Flex,
  Skeleton,
  Icon,
  List,
  ListItem,
  Badge,
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

interface MonthlyComparison {
  current: {
    income: number;
    expenses: number;
    net: number;
    count: number;
  };
  previous: {
    income: number;
    expenses: number;
    net: number;
    count: number;
  };
  changes: {
    income: number;
    expenses: number;
    net: number;
    count: number;
  };
}

interface TopTransaction {
  description: string;
  amount: number;
  category?: string;
  date: Date;
}

interface TopTransactions {
  topExpenses: TopTransaction[];
  topIncome: TopTransaction[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function DashboardPage() {
  const api = useAuthApi();
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [cashFlow, setCashFlow] = useState<CashFlowData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [comparison, setComparison] = useState<MonthlyComparison | null>(null);
  const [topTransactions, setTopTransactions] = useState<TopTransactions | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cashFlowData, categoryData, comparisonData, topData] = await Promise.all([
          api.get<CashFlowData[]>('/reports/cash-flow?months=6'),
          api.get<CategoryData[]>('/reports/category-breakdown'),
          api.get<MonthlyComparison>('/reports/monthly-comparison'),
          api.get<TopTransactions>('/reports/top-transactions?limit=5'),
        ]);
        setCashFlow(cashFlowData);
        setCategories(categoryData);
        setComparison(comparisonData);
        setTopTransactions(topData);
      } catch (e: any) {
        toast.error(`Erro ao carregar dashboard: ${e?.message || ''}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  };

  if (loading) {
    return (
      <Box>
        <Skeleton height="40px" mb="4" />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb="8">
          <Skeleton height="120px" />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb="8">
          <Skeleton height="350px" />
          <Skeleton height="350px" />
        </SimpleGrid>
      </Box>
    );
  }

  return (
    <Box pb="8">
      <Box mb="6">
        <Heading size="lg" mb="2">Dashboard</Heading>
        <Text color="gray.500">Visão geral do fluxo de caixa e performance financeira.</Text>
      </Box>

      {/* Monthly Comparison Cards */}
      {comparison && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb="8">
          <Card borderLeft="4px solid" borderLeftColor="brand.500">
            <CardBody>
              <Stat>
                <Flex alignItems="center" mb="2">
                  <Icon as={TrendingUp} color="brand.500" mr="2" />
                  <StatLabel color="gray.500">Receitas (Mês Atual)</StatLabel>
                </Flex>
                <StatNumber color="brand.600">
                  {formatCurrency(comparison.current.income)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={comparison.changes.income >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(comparison.changes.income).toFixed(1)}% vs mês anterior
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card borderLeft="4px solid" borderLeftColor="red.500">
            <CardBody>
              <Stat>
                <Flex alignItems="center" mb="2">
                  <Icon as={TrendingDown} color="red.500" mr="2" />
                  <StatLabel color="gray.500">Despesas (Mês Atual)</StatLabel>
                </Flex>
                <StatNumber color="red.600">
                  {formatCurrency(comparison.current.expenses)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={comparison.changes.expenses >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(comparison.changes.expenses).toFixed(1)}% vs mês anterior
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card borderLeft="4px solid" borderLeftColor={comparison.current.net >= 0 ? 'green.500' : 'red.500'}>
            <CardBody>
              <Stat>
                <Flex alignItems="center" mb="2">
                  <Icon as={DollarSign} color={comparison.current.net >= 0 ? 'green.500' : 'red.500'} mr="2" />
                  <StatLabel color="gray.500">Saldo (Mês Atual)</StatLabel>
                </Flex>
                <StatNumber color={comparison.current.net >= 0 ? 'green.600' : 'red.600'}>
                  {formatCurrency(comparison.current.net)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={comparison.changes.net >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(comparison.changes.net).toFixed(1)}% vs mês anterior
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card borderLeft="4px solid" borderLeftColor="purple.500">
            <CardBody>
              <Stat>
                <Flex alignItems="center" mb="2">
                  <Icon as={Activity} color="purple.500" mr="2" />
                  <StatLabel color="gray.500">Transações</StatLabel>
                </Flex>
                <StatNumber color="purple.600">
                  {comparison.current.count}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={comparison.changes.count >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(comparison.changes.count).toFixed(0)} vs mês anterior
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {/* Charts Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb="8">
        {/* Cash Flow Line Chart */}
        <Box bg="white" p="6" borderRadius="xl" shadow="sm">
          <Heading size="md" mb="6">Fluxo de Caixa (Últimos 6 Meses)</Heading>
          <Box h="350px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cashFlow}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  fontSize={12}
                />
                <YAxis
                  fontSize={12}
                  tickFormatter={(val) => `R$ ${val}`}
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  labelFormatter={(label) => formatMonth(label)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Line name="Receitas" type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line name="Despesas" type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line name="Saldo" type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Category Pie Chart */}
        <Box bg="white" p="6" borderRadius="xl" shadow="sm">
          <Heading size="md" mb="6">Despesas por Categoria (Mês Atual)</Heading>
          <Box h="350px">
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Flex h="100%" alignItems="center" justifyContent="center">
                <Text color="gray.400">Nenhuma despesa registrada neste mês</Text>
              </Flex>
            )}
          </Box>
        </Box>
      </SimpleGrid>

      {/* Top Transactions */}
      {topTransactions && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Top Expenses */}
          <Box bg="white" p="6" borderRadius="xl" shadow="sm">
            <Heading size="md" mb="4">Maiores Despesas (Mês Atual)</Heading>
            {topTransactions.topExpenses.length > 0 ? (
              <List spacing={3}>
                {topTransactions.topExpenses.map((t, idx) => (
                  <ListItem key={idx} p="3" bg="gray.50" borderRadius="md">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box flex="1">
                        <Text fontWeight="medium">{t.description}</Text>
                        {t.category && (
                          <Badge colorScheme="gray" fontSize="xs" mt="1">{t.category}</Badge>
                        )}
                      </Box>
                      <Text fontWeight="bold" color="red.600" fontSize="lg">
                        {formatCurrency(t.amount)}
                      </Text>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text color="gray.400">Nenhuma despesa registrada</Text>
            )}
          </Box>

          {/* Top Income */}
          <Box bg="white" p="6" borderRadius="xl" shadow="sm">
            <Heading size="md" mb="4">Maiores Receitas (Mês Atual)</Heading>
            {topTransactions.topIncome.length > 0 ? (
              <List spacing={3}>
                {topTransactions.topIncome.map((t, idx) => (
                  <ListItem key={idx} p="3" bg="gray.50" borderRadius="md">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box flex="1">
                        <Text fontWeight="medium">{t.description}</Text>
                        {t.category && (
                          <Badge colorScheme="gray" fontSize="xs" mt="1">{t.category}</Badge>
                        )}
                      </Box>
                      <Text fontWeight="bold" color="green.600" fontSize="lg">
                        {formatCurrency(t.amount)}
                      </Text>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text color="gray.400">Nenhuma receita registrada</Text>
            )}
          </Box>
        </SimpleGrid>
      )}
    </Box>
  );
}
