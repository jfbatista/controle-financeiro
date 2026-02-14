import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Heading,
    Text,
    Badge,
    Spinner,
    Button,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { useAuthApi } from '../services/authFetch';

interface AuditLog {
    id: number;
    action: string;
    entity: string;
    entityId: number | null;
    userId: number;
    details: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export function AuditLogsPage() {
    const api = useAuthApi();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const headerBg = useColorModeValue('gray.50', 'gray.700');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await api.get<AuditLog[]>('/audit');
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (log: AuditLog) => {
        setSelectedLog(log);
        onOpen();
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'green';
            case 'UPDATE': return 'blue';
            case 'DELETE': return 'red';
            case 'LOGIN': return 'purple';
            default: return 'gray';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={6}>
            <Heading mb={6}>Auditoria e Segurança</Heading>

            <Box bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor} overflow="hidden">
                <Table variant="simple">
                    <Thead bg={headerBg}>
                        <Tr>
                            <Th>Data/Hora</Th>
                            <Th>Usuário</Th>
                            <Th>Ação</Th>
                            <Th>Entidade</Th>
                            <Th>Detalhes</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {logs.map((log) => (
                            <Tr key={log.id}>
                                <Td>{new Date(log.createdAt).toLocaleString('pt-BR')}</Td>
                                <Td>
                                    <Text fontWeight="bold">{log.user.name}</Text>
                                    <Text fontSize="sm" color="gray.500">{log.user.email}</Text>
                                </Td>
                                <Td>
                                    <Badge colorScheme={getActionColor(log.action)}>{log.action}</Badge>
                                </Td>
                                <Td>
                                    <Text>{log.entity}</Text>
                                    {log.entityId && <Text fontSize="xs" color="gray.500">ID: {log.entityId}</Text>}
                                </Td>
                                <Td>
                                    {log.details && (
                                        <Button size="xs" onClick={() => handleViewDetails(log)}>
                                            Ver JSON
                                        </Button>
                                    )}
                                </Td>
                            </Tr>
                        ))}
                        {logs.length === 0 && (
                            <Tr>
                                <Td colSpan={5} textAlign="center" py={4}>
                                    Nenhum registro encontrado.
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Details Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Detalhes do Registro</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedLog && (
                            <Box as="pre" p={4} bg="gray.100" borderRadius="md" overflowX="auto" fontSize="sm">
                                {JSON.stringify(JSON.parse(selectedLog.details || '{}'), null, 2)}
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}
