import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CoursesProvider } from "@/contexts/CoursesContext";
import { WebinarsProvider } from "@/contexts/WebinarsContext";
import { EnrollmentsProvider } from "@/contexts/EnrollmentsContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CoursesProvider>
        <WebinarsProvider>
          <FavoritesProvider>
            <EnrollmentsProvider>
              <Component {...pageProps} />
            </EnrollmentsProvider>
          </FavoritesProvider>
        </WebinarsProvider>
      </CoursesProvider>
    </AuthProvider>
  );
}
