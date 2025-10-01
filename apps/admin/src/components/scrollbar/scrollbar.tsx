import clsx, { ClassValue } from "clsx";
import React, { PropsWithChildren } from "react";
import { StyledRootScrollbar, StyledScrollbar } from "./styles";

// ----------------------------------------------------------------------

interface ScrollbarProps {
  ref?: React.Ref<HTMLDivElement>;
  className?: ClassValue;
}

// ----------------------------------------------------------------------

const Scrollbar: React.FC<PropsWithChildren<ScrollbarProps>> = ({
  ref,
  children,
  className,
}) => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  if (isMobile) {
    return (
      <div ref={ref} className={clsx("overflow-auto", className)}>
        {children}
      </div>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar
        scrollableNodeProps={{
          ref,
        }}
        clickOnTrack={false}
        className={clsx(className)}
      >
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
};

export default Scrollbar;
