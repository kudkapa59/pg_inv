import type { NextPage } from 'next'
import { Container, Typography, Divider, Grid, Box, Link } from '@mui/material'
import Masonry from '@mui/lab/Masonry';
import CoBaCard from '../components/CoBaCard';
import EnvironmentOverviewCard from '../components/EnvironmentOverviewCard';
//
//
//  Home - This file represents the root page (http://<domain.local>/)
//  This Page contains an overview about the Product and provides contact information
// 
const Home: NextPage = () => {
    return (
        <Container maxWidth="lg">
            <Masonry columns={2} spacing={2} sx={{ mt: 2, mb: '100px' }} >
                {/* =================================================
                                 Product Information 
                =====================================================*/}
                <CoBaCard title="Product Information">
                    <Grid container columns={{ xs: 2, sm: 2, md: 2 }}>
                        <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="google-cloud-logo.jpg" width="100%" alt="google cloud logo" />
                            <img src="azure-cloud-logo.png" width="100%" alt="microsoft azure logo" />
                            {/* <img src="gcp_cloudsql.png" width="50%" /> */}
                        </Grid>
                        <Grid item xs={1} sm={1} md={1}>
                            <Typography>Cloud SQL is a fully managed database ‘Platform-as-a-Service’ (PaaS) based on PostgreSQL on the Google-Cloud-Platform(GCP). It guarantees full compatibility for PostgreSQL applications on the major versions: 14, 13. Cloud SQL supports the most popular PostgreSQL extensions and over 100 database flags.</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Grid container columns={{ xs: 2, sm: 2, md: 2 }}>
                        <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="postgresql.png" width="60%" />
                        </Grid>
                        <Grid item xs={1} sm={1} md={1}>
                            <Typography>PostgreSQL is a powerful, open-source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.</Typography>
                        </Grid>
                    </Grid>
                </CoBaCard>
                {/* =================================================
                                     The Service 
                =====================================================*/}
                <CoBaCard title="The Service">
                    <Typography>We are providing a centrally managed <b>DB-Administration-Service for CloudSQL</b> based on Postgres. The product is continuously improved by Google, but some functions are still in 'beta'-status. Due to the lack of operational experience and resources, the usage of this service is currently not recommended for applications having BCM-class 1 and 2 ("critical" and "very critical").</Typography>

                    <ul>
                        <li><a href="https://confluence.intranet.commerzbank.com/display/OPENDBS/OPENDBS+Home" target="_blank" className="external-link">Here</a> you find more details about our service</li>
                        <li><a href="https://architecture.intranet.commerzbank.com/software-products/01-49-21/details" target="_blank" className="external-link">A-App | 01-49-21 | Azure Database for PostgreSQL</a></li>
                        <li><a href="https://architecture.intranet.commerzbank.com/software-products/01-43-71/details" target="_blank" className="external-link">A-App | 01-43-71 | Cloud SQL for PostgreSQL on GCP</a></li>
                    </ul>
                    <Typography><b>Service Hours:</b> Mo – Fr, 08:00 – 17:00 h</Typography>
                    <Typography><b>Email Contact:</b> opendbs@commerzbank.com</Typography>
                </CoBaCard>
                {/* =================================================
                                 Environment Overview 
                =====================================================*/}
                <EnvironmentOverviewCard />
            </Masonry>
        </Container >
    )
};

export default Home;
