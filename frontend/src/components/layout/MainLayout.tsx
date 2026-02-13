import type { ReactNode } from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  Link as ChakraLink,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  CreditCard,
  CalendarClock,
  LogOut,
  Menu as MenuIcon,
  Wallet,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';

interface MainLayoutProps {
  children: ReactNode;
}

const LinkItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Lançamentos', icon: Receipt, path: '/transactions' },
  { name: 'Contas Fixas', icon: CalendarClock, path: '/recurring-bills' },
  { name: 'Categorias', icon: Tags, path: '/categories' },
  { name: 'Formas de Pag.', icon: CreditCard, path: '/payment-methods' },
];

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* Mobile Nav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps {
  onClose: () => void;
  display?: object;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const location = useLocation();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <HStack spacing={2}>
          <Icon as={Wallet} color="brand.500" w={8} h={8} />
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Fluxo
          </Text>
        </HStack>
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          variant="outline"
          aria-label="close menu"
          icon={<Icon as={LogOut} />} // Close icon replacement
        />
      </Flex>
      <VStack align="stretch" spacing={1} px={4}>
        {LinkItems.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <ChakraLink
              key={link.name}
              as={Link}
              to={link.path}
              style={{ textDecoration: 'none' }}
              onClick={onClose} // Auto close on mobile
            >
              <Flex
                align="center"
                p="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? 'brand.500' : 'transparent'}
                color={isActive ? 'white' : 'gray.600'}
                _hover={{
                  bg: isActive ? 'brand.600' : 'brand.50',
                  color: isActive ? 'white' : 'brand.600',
                }}
                transition="all 0.2s"
              >
                <Icon
                  mr="4"
                  fontSize="16"
                  as={link.icon}
                />
                <Text fontWeight={isActive ? '600' : '500'}>{link.name}</Text>
              </Flex>
            </ChakraLink>
          );
        })}
      </VStack>
    </Box>
  );
};

interface MobileProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen }: MobileProps) => {
  const { user, logout } = useAuthStore();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      display={{ base: 'flex', md: 'flex' }} // Always show header for user profile
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<Icon as={MenuIcon} />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontWeight="bold"
      >
        Fluxo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  name={user?.name}
                  bg="brand.500"
                  color="white"
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user?.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem icon={<Icon as={LogOut} />} onClick={logout} color="red.500">
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
