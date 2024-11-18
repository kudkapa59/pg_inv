import type { NextPage } from 'next';
import { Container, Typography, Grid, Stack, Chip, Alert, LinearProgress, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CoBaCard from '../../components/CoBaCard';
import { useState, useEffect } from 'react';
import { Application } from '../../models/Application';
import ResponsibilitiesCard from '../../components/ResponsibilitiesCard';
import { theme } from '../../config/theme';
import LaunchIcon from '@mui/icons-material/Launch';
import Link from 'next/link';
import Head from 'next/head'

const envs = ["dev", "tuc", "tud", "prd"];

function getEnvFromName(name: string) {
    for (const env of envs) {
        if (name.includes(`-${env}-`)) {
            return env;
        }
    }
}

//
// This component represents the application details view.
// All available information about an application is presented in this view.
//
const ApplicationID: NextPage = () => {
    const router = useRouter();
    const { id } = router.query
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<Application | undefined>();

    /* =================================================
                       Data Fetching
    =====================================================*/
    useEffect(() => {
        setLoading(true);
        // fetch single application from backend
        //
        // GET /api/applications/<coriaid>
        // return:
        //   application details as json
        //
        // the corresponding backend implementation can be found in "dashboard/pages/api/applications/[id].ts"
        fetch(`/api/applications/${id}`).then(async (res) => {
            if (res.ok) {
                const json = await res.json();
                setApplication(json as Application);
            }
        }).finally(() => setLoading(false))
    }, [id]);

    /* =================================================
                       Error or Loading
    =====================================================*/
    if (application === undefined) {
        if (!loading) {
            return (
                <>
                    <Head>
                        <title>PG_INV | Instances</title>
                    </Head>
                    <Container maxWidth="lg" sx={{ my: 2 }}>
                        <Alert severity="error">Error: No Data found for requested ID!</Alert>
                    </Container >
                </>
            )
        } else {
            return (
                <>
                    <Head>
                        <title>PG_INV | Applications</title>
                    </Head>
                    <LinearProgress color="secondary" />
                </>
            )
        }
    }

    return (
        <>
            <Head>
                <title>PG_INV | Applications</title>
            </Head>
            {loading ? <LinearProgress color="secondary" /> : <Box sx={{ height: '4px' }} />}
            <Container maxWidth="lg" sx={{ my: 2 }}>
                <Typography variant="h6" sx={{ mt: 4 }}>Application</Typography>
                <Typography variant="h3" sx={{ mb: 3 }}>{id}</Typography>
                <Grid container maxWidth="lg" spacing={2} columns={{ xs: 4, sm: 8, md: 8 }}>
                    {/* =================================================
                                        General Information 
                    =====================================================*/}
                    <Grid item xs={4} sm={4} md={4}>
                        <CoBaCard title="General Information" info="General information about the respective application is noted under this section">
                            <Grid container maxWidth="lg" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                                <Grid item xs={4} sm={4} md={4}>
                                    <Stack justifyContent="flex-start" alignItems="flex-start">
                                        <Typography variant="caption" color={'gray'}>CoRIA ID:</Typography>
                                        <Typography>{application.product_nr}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4}>
                                    <Stack justifyContent="flex-start" alignItems="flex-start">
                                        <Typography variant="caption" color={'gray'}>CoBa Name:</Typography>
                                        <Typography>{application.product_name}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4}>
                                    <Stack justifyContent="flex-start" alignItems="flex-start">
                                        <Typography variant="caption" color={'gray'}>Criticality:</Typography>
                                        {application.availability_class ?
                                            <Chip
                                                sx={{ pl: 0 }}
                                                icon={<Chip style={{ marginLeft: 0, color: theme.palette.secondary.main }} color="primary" label={application.availability_class} />}
                                                label={application.bcm_klasse}
                                                variant="outlined"
                                                color="primary"
                                            /> :
                                            <Chip label="Error: No class found!" color="warning" />}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CoBaCard>
                    </Grid>
                    {/* =================================================
                                      Architecture App 
                    =====================================================*/}
                    <Grid item xs={4} sm={4} md={4}>
                        <CoBaCard title="Architecture App" info="Detailed information about the application can be found in the architecture app. (Info: The Link opens a new tab.)">
                            <Button endIcon={<LaunchIcon />} >
                                <a
                                    href={`https://architecture.intranet.commerzbank.com/software-products/${application.product_nr}/details`}
                                    target="_blank"
                                >
                                    Navigate to Architecture App
                                </a>
                            </Button>
                        </CoBaCard>
                    </Grid>
                    {/* =================================================
                                           Instances 
                    =====================================================*/}
                    <Grid item xs={4} sm={8} md={8}>
                        <CoBaCard title="Instances" info="List of all instances associated with this application.">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Name</TableCell>
                                            <TableCell align="left">Environment</TableCell>
                                            <TableCell align="left">Version</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {application.instances.map((instance, index) => (
                                            <Link key={index} href={`/instances/${instance.instance_name}`}>
                                                <TableRow
                                                    key={instance.coba_coria}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                        '&:hover': {
                                                            backgroundColor: '#fafafa'
                                                        }
                                                    }}
                                                >
                                                    <TableCell align="left"><Typography>{instance.instance_name}</Typography></TableCell>
                                                    <TableCell align="left"><Chip label={getEnvFromName(instance.project)} color="primary" title={instance.project} /></TableCell>
                                                    <TableCell align="left">{instance.version.split('_').slice(1).join('.')}</TableCell>
                                                </TableRow>
                                            </Link>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CoBaCard>
                    </Grid>
                    {/* =================================================
                                       Responsibilites 
                    =====================================================*/}
                    <Grid item xs={4} sm={8} md={8}>
                        <ResponsibilitiesCard responsibilites={application.responsibilites} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default ApplicationID;
