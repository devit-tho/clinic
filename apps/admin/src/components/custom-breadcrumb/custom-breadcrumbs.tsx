import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface LinkItem {
  name?: string;
  href?: string;
}

interface CustomBreadcrumbsProp {
  heading: string;
  links: LinkItem[];
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProp> = ({
  heading,
  links,
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      <h4 className="text-3xl font-medium">{heading}</h4>

      <Breadcrumbs
        aria-label="breadcrumbs"
        size="lg"
        itemClasses={{
          separator: "px-0",
        }}
        separator={<Icon icon="mdi:dot" className="size-6" />}
      >
        {links.map((link, i) => (
          <BreadcrumbItem key={i}>
            <Link to={link.href as string}>{link.name}</Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default CustomBreadcrumbs;
