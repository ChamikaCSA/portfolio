import {
  Boxes,
  History,
  House,
  Layers,
  Mail,
  Settings,
  SquareTerminal,
  User,
  type LucideIcon,
} from "lucide-react";

export const APP_ICONS: Record<string, LucideIcon> = {
  home: House,
  projects: Boxes,
  experience: History,
  stack: Layers,
  contact: Mail,
  about: User,
  terminal: SquareTerminal,
  settings: Settings,
};
