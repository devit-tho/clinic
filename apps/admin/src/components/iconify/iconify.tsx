import { Icon, IconifyIcon, IconProps } from "@iconify/react";

interface IconifyProps extends IconProps {
  icon: string | IconifyIcon;
  width?: number;
}

function Iconify({ icon, width, ...props }: IconifyProps) {
  return <Icon icon={icon} width={width} height={width} {...props} />;
}

export type { IconifyIcon };

export default Iconify;
