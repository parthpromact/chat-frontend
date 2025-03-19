import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthProvider";
import { Provider } from "react-redux";
import store from "@/stores";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}
