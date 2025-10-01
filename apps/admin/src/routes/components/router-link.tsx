import { Ref } from "react";
import { Link, LinkProps } from "react-router-dom";

// ----------------------------------------------------------------------

interface RouterLinkProps extends Omit<LinkProps, "to"> {
  ref?: Ref<HTMLAnchorElement>;
  href: string;
}

// ----------------------------------------------------------------------

const RouterLink: React.FC<RouterLinkProps> = ({ ref, href, ...other }) => (
  <Link ref={ref} to={href} {...other} />
);

export default RouterLink;
