import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { AuthConsumer, AuthProvider } from "./auth/context/jwt";
import Router from "./routes";

// scrollbar
import "simplebar-react/dist/simplebar.min.css";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HeroUIProvider locale="en-GB">
      <ToastProvider placement="top-right" />
      <AuthProvider>
        <AuthConsumer>
          <Router />
        </AuthConsumer>
      </AuthProvider>
    </HeroUIProvider>
  );
}
