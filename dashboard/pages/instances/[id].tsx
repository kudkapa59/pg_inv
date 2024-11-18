import type { NextPage } from 'next'
import { Container, Typography, Alert, LinearProgress, Box, ListItemText, List, ListItem, ListItemIcon, Button } from '@mui/material'
import { useRouter } from 'next/router';
import StorageIcon from '@mui/icons-material/Storage';
import Masonry from '@mui/lab/Masonry';
import CoBaCard from '../../components/CoBaCard';
import { useState, useEffect } from 'react';
import { Instance } from '../../models/Instance';
import PersonIcon from '@mui/icons-material/Person';
import InstanceGeneralInfoCard from '../../components/InstanceGeneralInfoCard';
import InstanceResourcesCard from '../../components/InstanceResourcesCard';
import InstanceLabels from '../../components/InstanceLabels';
import Link from 'next/link';
import Head from 'next/head'


function createCoriaWithHyphon(coria: string): string {
    if (coria.length < 6 || coria.includes('-')) {
        return coria;
    }
    return coria.slice(0, 2) + '-' + coria.slice(2, 4) + '-' + coria.slice(4, 6)
}

//
// This component represents the instance details view.
// All available information about an instance is presented in this view.
//
const InstanceID: NextPage = () => {
    const router = useRouter();
    const { id } = router.query
    const [loading, setLoading] = useState(true);
    const [instance, setInstance] = useState<Instance | undefined>();

    /* =================================================
                       Data Fetching
    =====================================================*/
    useEffect(() => {
        setLoading(true);
        // fetch single instance from backend
        //
        // GET /api/instances/<instance-name>
        // return:
        //   instance details as json
        //
        // the corresponding backend implementation can be found in "dashboard/pages/api/instances/[id].ts"
        fetch(`/api/instances/${id}`).then(async (res) => {
            if (res.ok) {
                const json = await res.json();
                setInstance(json as Instance);
            }
        }).finally(() => setLoading(false))
    }, [id]);

    /* =================================================
                       Error or Loading
    =====================================================*/
    if (instance === undefined) {
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
                        <title>PG_INV | Instances</title>
                    </Head>
                    <LinearProgress color="secondary" />
                </>
            )
        }
    }

    return (
        <>
            <Head>
                <title>PG_INV | Instances</title>
            </Head>
            {loading ? <LinearProgress color="secondary" /> : <Box sx={{ height: '4px' }} />}
            <Container maxWidth="lg" sx={{ my: 2 }}>
                <Typography variant="h6" sx={{ mt: 4 }}>Instance</Typography>
                <Typography variant="h3" sx={{ mb: 3 }}>{id}</Typography>
                {/* =================================================
                                General Information
                =====================================================*/}
                <InstanceGeneralInfoCard instance={instance} />
                <Masonry columns={2} spacing={2} sx={{ my: 2 }} >
                    {/* =================================================
                                           Labels
                    =====================================================*/}
                    <InstanceLabels instance={instance} />
                    {/* =================================================
                                          Resources
                    =====================================================*/}
                    <InstanceResourcesCard instance={instance} />
                    {/* =================================================
                                          Databases
                    =====================================================*/}
                    <CoBaCard title="Databases" info="List of all databases pressent on this instance.">
                        {instance.databases && instance.databases.length > 0 ? (
                            <List>
                                {instance.databases.map((database) => (
                                    <ListItem key={database.name}>
                                        <ListItemIcon>
                                            <StorageIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={`${database.name} (charset: ${database.charset})`} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                                <Alert severity="error">No databases found!</Alert>
                            )}
                    </CoBaCard>
                    {/* =================================================
                                         Database Users
                    =====================================================*/}
                    <CoBaCard title="Database Users" info="List of all database users pressent on this instance.">
                        {instance.dbusers && instance.dbusers.length > 0 ? (
                            <List>
                                {instance.dbusers.map((user) => (
                                    <ListItem key={user.name}>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={user.name}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                                <Alert severity="error">No database users found!</Alert>
                            )}
                    </CoBaCard>
                    {/* =================================================
                                         Application 
                    =====================================================*/}
                    {instance.coba_coria &&
                        <CoBaCard title="Application" info="Link to the application this instance is related to.">
                            <Button><Link href={`/applications/${createCoriaWithHyphon(instance.coba_coria)}`}>Navigate to Application</Link></Button>
                        </CoBaCard>
                    }
                </Masonry>
            </Container>
        </>
    )
}

export default InstanceID;
