import { RouterLink } from "@/routes/components";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import clsx, { ClassValue } from "clsx";

// ----------------------------------------------------------------------

interface LogoProps {
  ref?: React.Ref<HTMLImageElement>;
  disabledLink?: boolean;
  className?: ClassValue;
}

// ----------------------------------------------------------------------

const Logo: React.FC<LogoProps> = ({ ref, disabledLink, className }) => {
  const logo = (
    <Image
      ref={ref}
      src="/images/dental-logo.png"
      alt="logo"
      className={clsx("size-16", className)}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link as={RouterLink} href="/" className="contents">
      {logo}
    </Link>
  );
};

export default Logo;
