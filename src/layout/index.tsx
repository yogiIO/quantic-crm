import {
  AppShell,
  Burger,
  Group,
  Text,
  Box,
  Tooltip,
  Stack,
  useComputedColorScheme,
  Flex,
  ActionIcon,
} from "@mantine/core";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { NavLink, Outlet } from "react-router-dom";
import {
  IconFileDollar,
  IconMenu2,
  IconMenuDeep,
  IconPresentationAnalytics,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import type { Icon as TablerIcon } from "@tabler/icons-react";
import { RoutePath } from "../routes/route-path";

interface NavItemProps {
  label: string;
  path: string;
  Icon: TablerIcon;
  opened: boolean;
}

export default function Layout() {
  const [opened, setOpened] = useState<boolean>(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const themeMode = useComputedColorScheme();
  const isDark = themeMode === "dark";

  return (
    <AppShell
      layout="alt"
      navbar={{
        width: opened ? 300 : 80,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      footer={{ height: 50 }}
      padding="md"
    >
      <AppShell.Header h={60}>
        <Group h="100%" px="md" justify="space-between">
          <ActionIcon
            variant="transparent"
            onClick={() => setOpened((o) => !o)}
          >
            {opened ? (
              <IconMenu2 color={isDark ? "white" : "black"} />
            ) : (
              <IconMenuDeep color={isDark ? "white" : "black"} />
            )}
          </ActionIcon>
          <Group>
            <Flex align={"center"} justify={"center"}>
              <IconUser />
            </Flex>
            <Text fw={"bold"}>Admin</Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        style={{
          transition: "width 200ms ease",
          overflow: "hidden",
        }}
      >
        <Stack gap={"xl"} p={"md"} h={"100%"} justify="space-between">
          <Stack>
            <Group justify="space-between">
              <Group p={"xs"}>
                <IconPresentationAnalytics />
                {opened && <Text fw={"bold"}>Quantic CRM</Text>}
              </Group>
              {isMobile && (
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                />
              )}
            </Group>
            <Stack gap={"sm"}>
              <NavItem
                label={"Customers"}
                path={RoutePath.CUSTOMERS}
                Icon={IconUsersGroup}
                opened={opened}
              />
              <NavItem
                label={"Invoices"}
                path={RoutePath.INVOICES}
                Icon={IconFileDollar}
                opened={opened}
              />
            </Stack>
          </Stack>
          <Text variant="dimmed" size="xs" lh="20px" fw={600}>
            {!opened ? "© 2025" : "Copyright © 2025"}
          </Text>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box p="md">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

function NavItem({ label, path, Icon, opened }: NavItemProps) {
  return (
    <Tooltip
      label={label}
      position="right"
      disabled={opened}
      withArrow
      transitionProps={{ duration: 100 }}
    >
      <NavLink to={path}>
        {({ isActive }) => {
          return (
            <Flex
              gap="md"
              p="xs"
              align="center"
              style={{
                borderRadius: 4,
                backgroundColor: isActive
                  ? "rgba(0, 0, 0, 0.1)"
                  : "transparent",
                fontWeight: isActive ? 600 : 400,
                color: isActive
                  ? "var(--mantine-color-blue-7)"
                  : "var(--mantine-color-text)",
                textDecoration: "none",
                transition: "background-color 150ms ease",
              }}
            >
              <Icon />
              {opened && <Text size="sm">{label}</Text>}
            </Flex>
          );
        }}
      </NavLink>
    </Tooltip>
  );
}
