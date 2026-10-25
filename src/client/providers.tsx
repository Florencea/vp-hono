import "./global.css";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useState, type ReactNode } from "react";
import { I18nProvider } from "./components/I18nProvider.tsx";
import { ToastRegion } from "./components/ui/toast.tsx";
import { router } from "./constants/routes.tsx";
import { ThemeProvider } from "./theme.tsx";
import { toast } from "./utils/toast.ts";

interface Props {
  children?: ReactNode;
  queryClient?: QueryClient | undefined;
}

interface ProviderProps extends Props {
  container?: HTMLElement | undefined;
}

const AppRouterProvider = () => {
  const queryClient = useQueryClient();
  return <RouterProvider router={router} context={{ queryClient }} />;
};

export const Providers = ({ children, queryClient }: ProviderProps) => {
  return (
    <StrictMode>
      <ThemeProvider>
        <I18nProvider>
          <ApiProvider queryClient={queryClient}>
            {children ?? <AppRouterProvider />}
            <ToastRegion />
          </ApiProvider>
        </I18nProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

const ApiProvider = ({ children, queryClient: customQueryClient }: Props) => {
  const [defaultQueryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            if (err.message !== "") {
              toast.error(err.message);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (err) => {
            if (err.message !== "") {
              toast.error(err.message);
            }
          },
        }),
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  );

  const queryClient = customQueryClient ?? defaultQueryClient;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
