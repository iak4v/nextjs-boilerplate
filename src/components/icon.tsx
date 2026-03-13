import { icons } from "lucide-react";
import { LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;

export const Icon = ({
  name,
  fallback,
  ...props
}: { name?: IconName; fallback: IconName } & LucideProps) => {
  const Icon = name && name in icons ? icons[name] : icons[fallback];
  return <Icon {...props} />;
};

