/**
 * Export barrel pour tous les composants UI
 * Facilite l'importation des composants
 */

export { default as Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { default as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export type { CardProps } from './Card';

export { default as Modal, ModalFooter } from './Modal';
export type { ModalProps } from './Modal';

export { default as Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

export { default as Tabs } from './Tabs';
export type { TabsProps, Tab } from './Tabs';

export { default as Navbar } from './Navbar';
export type { NavbarProps, NavLink } from './Navbar';

export { default as Sidebar } from './Sidebar';
export type { SidebarProps, SidebarLink, SidebarSection } from './Sidebar';
