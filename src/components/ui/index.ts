// shadcn/ui components
export { Button, buttonVariants } from './button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Input as ShadcnInput, Textarea as ShadcnTextarea } from './input';
export type { InputProps as ShadcnInputProps, TextareaProps as ShadcnTextareaProps } from './input';
export { Label } from './label';
export { Badge, badgeVariants } from './badge';
export { Separator } from './separator';
export {
  Avatar as ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
} from './avatar';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './sheet';
export {
  Select as ShadcnSelect,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';
export { ScrollArea, ScrollBar } from './scroll-area';
export { Switch } from './switch';
export { Checkbox } from './checkbox';
export { Progress } from './progress';
export { Skeleton } from './skeleton';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog';
export { Popover, PopoverTrigger, PopoverContent } from './popover';

// Legacy components (backward-compatible API for client pages)
export { LegacyAvatar as Avatar } from './LegacyAvatar';
export { LegacyInput as Input, LegacyTextarea as Textarea } from './LegacyInput';
export type { LegacyInputProps as InputProps, LegacyTextareaProps as TextareaProps } from './LegacyInput';
export { LegacySelect as Select } from './LegacySelect';
export type { LegacySelectProps as SelectProps } from './LegacySelect';

// Legacy custom components
export { Modal } from './Modal';
export { Drawer } from './Drawer';
export { Toast } from './Toast';
export { EmptyState } from './EmptyState';
export { StatCard } from './StatCard';
export { ChannelIcon, channelLabel, channelColor } from './ChannelIcon';
export { DataTable } from './DataTable';
export type { Column } from './DataTable';
export { ConfirmProvider, useConfirm } from './ConfirmDialog';
export { EmojiPicker } from './EmojiPicker';
export { CommandPalette } from './CommandPalette';
