import { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default MyApp;