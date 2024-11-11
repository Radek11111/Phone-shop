import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import store from "../store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "blockButton",
            socialButtonsPlacement: "bottom",
            logoImageUrl: "/assets/images/logo.svg",
          },
        }}
        signUpUrl="/sign-up"
        signInUrl="/sign-in"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      >
        {children}
      </ClerkProvider>
    </Provider>
  );
}
