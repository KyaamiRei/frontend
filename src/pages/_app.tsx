import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Component {...pageProps} />
      </FavoritesProvider>
    </AuthProvider>
  );
}
