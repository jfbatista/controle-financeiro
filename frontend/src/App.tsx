import { Box, Flex, Text } from '@chakra-ui/react'

function App() {
  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center">
      <Box bg="white" p={8} rounded="lg" shadow="lg">
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Controle Financeiro
        </Text>
        <Text color="gray.600">
          Frontend inicial pronto. Em breve adicionaremos login, dashboard,
          lançamentos e configurações.
        </Text>
      </Box>
    </Flex>
  )
}

export default App

