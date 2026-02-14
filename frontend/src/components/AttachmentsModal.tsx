import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    HStack,
    Text,
    Icon,
    IconButton,
    Box,
    Input,
    useToast,
    Link,
    Spinner,
} from '@chakra-ui/react';
import { Download, Trash2, Upload, FileText } from 'lucide-react';
import { useState } from 'react';
import { useAuthApi } from '../services/authFetch';
import { useAuthStore } from '../store/auth';

interface Attachment {
    id: number;
    filename: string;
    size: number;
    mimetype: string;
    createdAt: string;
}

interface AttachmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: number;
    existingAttachments?: Attachment[];
    onUpdate: () => void; // Callback to refresh transaction list
}

export function AttachmentsModal({ isOpen, onClose, transactionId, existingAttachments = [], onUpdate }: AttachmentsModalProps) {
    const api = useAuthApi();
    const toast = useToast();
    const { accessToken } = useAuthStore();
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            // Use fetch directly for FormData to avoid Content-Type header issues with some wrappers
            // But useAuthApi wrapper might handle it if we pass body as FormData?
            // Let's try direct fetch with token for safety on multipart
            const response = await fetch(`http://localhost:3000/uploads/transaction/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    // 'Content-Type': 'multipart/form-data' // DO NOT SET THIS MANUALLY, browser does it with boundary
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Falha no upload');
            }

            toast({ status: 'success', title: 'Upload concluído!' });
            onUpdate(); // Prepare to refresh
            // We don't have separate state for attachments in this modal, 
            // we rely on the parent properly passing updated existingAttachments or we could fetch them here.
            // For MVP, calling onUpdate() acts as "refresh parent".
        } catch (error) {
            console.error(error);
            toast({ status: 'error', title: 'Erro ao enviar arquivo' });
        } finally {
            setUploading(false);
            // Reset input value
            e.target.value = '';
        }
    };

    const handleDownload = (id: number, filename: string) => {
        // Open in new tab? Or download.
        // Logic: Authenticated download via token?
        // Browser can't send headers in window.open.
        // Solution: use fetchMain and blob.
        downloadFile(id, filename);
    };

    const downloadFile = async (id: number, filename: string) => {
        try {
            const response = await api.get<Blob>(`/uploads/${id}`, { responseType: 'blob' });
            // response is already a Blob due to httpGet implementation
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (e: any) {
            console.error('Download error:', e);
            toast({
                status: 'error',
                title: 'Erro ao baixar arquivo',
                description: e.message || 'Verifique sua conexão ou permissões.'
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Anexos</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {/* Upload Area */}
                        <Box
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="md"
                            p={6}
                            textAlign="center"
                            transition="all 0.2s"
                            _hover={{ borderColor: 'brand.500', bg: 'brand.50' }}
                        >
                            <Input
                                type="file"
                                id="file-upload"
                                display="none"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                <VStack spacing={2}>
                                    {uploading ? <Spinner /> : <Icon as={Upload} boxSize={8} color="gray.400" />}
                                    <Text color="gray.600">
                                        {uploading ? 'Enviando...' : 'Clique para selecionar um arquivo'}
                                    </Text>
                                </VStack>
                            </label>
                        </Box>

                        {/* List */}
                        <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto">
                            {existingAttachments.length === 0 ? (
                                <Text color="gray.500" textAlign="center" py={4}>Nenhum anexo.</Text>
                            ) : (
                                existingAttachments.map((att) => (
                                    <HStack key={att.id} p={3} bg="gray.50" borderRadius="md" justify="space-between">
                                        <HStack>
                                            <Icon as={FileText} color="brand.500" />
                                            <VStack align="start" spacing={0}>
                                                <Text fontWeight="medium" isTruncated maxW="200px">{att.filename}</Text>
                                                <Text fontSize="xs" color="gray.500">{(att.size / 1024).toFixed(1)} KB</Text>
                                            </VStack>
                                        </HStack>
                                        <HStack>
                                            <IconButton
                                                aria-label="Download"
                                                icon={<Download size={16} />}
                                                size="sm"
                                                onClick={() => handleDownload(att.id, att.filename)}
                                            />
                                            {/* Delete functionality not requested but easy to add later */}
                                        </HStack>
                                    </HStack>
                                ))
                            )}
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Fechar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
