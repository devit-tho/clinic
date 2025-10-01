import SimpleBar from "simplebar-react";
import styled from "styled-components";

// ----------------------------------------------------------------------

export const StyledRootScrollbar = styled.div`
  @apply flex-grow h-full overflow-hidden;
`;

export const StyledScrollbar = styled(SimpleBar)`
  @apply max-h-full;

  .simplebar-scrollbar {
    &:before {
      @apply bg-foreground-50 opacity-50 transition-opacity;
    }
    &.simplebar-visible:before {
      @apply opacity-100;
    }
  }

  .simplebar-mask {
    z-index: inherit;
  }
`;
