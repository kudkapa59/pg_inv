import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Box } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import CoBaNavbar from '../components/CoBaNavbar';
import { theme } from '../config/theme';
import Head from 'next/head'
//
//  Dashboard init file
//  React + Next.js is used - Pages are rendered on the backend.
//  All pages are injected into this template which provides a navigation bar and a base style.
// 
function MyApp({ Component, pageProps }: AppProps) {
    const navbarItems = [{ title: "instances", link: "/instances" }, { title: "applications", link: "/applications" }];

    return (
        <>
            <Head>
                <title>PG_INV | Overview</title>
                <link rel="shortcut icon" href="/favicon.png" />
            </Head>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    backgroundColor: '#fafafa',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <CoBaNavbar navbarItems={navbarItems} />
                    <main style={{ marginTop: '64px' }}>
                        <Component {...pageProps} />
                    </main>
                </Box>
            </ThemeProvider>
        </>
    )
}

export default MyApp
