import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MoreInfos from './MoreInfos';
import Link from 'next/link';
import useLastScanDate from '../hooks/LastScanDateHook';
import { useRouter } from 'next/router';

interface CoBaNavbarProps {
    navbarItems: { title: string, link: string }[]
}

const CoBaNavbar: React.FC<CoBaNavbarProps> = (props) => {
    const router = useRouter();

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ mx: '16px' }} disableGutters>
                {/* App Title */}
                <Typography
                    variant="h6"
                    noWrap
                    style={{ textDecoration: 'none' }}
                    color="secondary"
                    sx={{ mr: 2 }}
                >
                    <Link href="/" style={{ textDecoration: 'none' }}>PG_INV</Link>
                </Typography>

                {/* additional buttons */}
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                    {props.navbarItems &&
                        props.navbarItems.map((entry) => {
                            return (
                                <Link key={entry.title} href={entry.link}>
                                    <Button size="large" color="inherit" sx={{ mr: 2 }} style={{ backgroundColor: router.route.startsWith(entry.link) ? "rgba(0,0,0,0.2)" : "transparent" }}>
                                        {entry.title}
                                    </Button>
                                </Link>
                            );
                        })}
                </Box>
                <LastScanDate />
                {/* Three dotted menu that shows additional info */}
                <MoreInfos appVersion={"1.0.0"} supportLink={"mailto:pg_support@commerzbank.com"} />
            </Toolbar>
        </AppBar >
    );
}

function LastScanDate(): JSX.Element {
    const scanDate = useLastScanDate();

    if (scanDate.loading || scanDate.error || scanDate.value === undefined) {
        return <></>;
    }

    return <Typography sx={{ backgroundColor: "rgba(0,0,0,0.3)", p: 1, borderRadius: 2 }}>
        Last Scan Date: <b>{scanDate.value.split('T')[0]}</b></Typography>;
}

export default CoBaNavbar