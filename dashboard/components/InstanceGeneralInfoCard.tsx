import { Grid, Typography, Chip, Stack } from '@mui/material'
import { Instance } from '../models/Instance';
import CoBaCard from './CoBaCard';


const InstanceGeneralInfoCard: React.FC<{ instance: Instance }> = ({ instance }) => {
    return (
        <CoBaCard sx={{ my: 2, p: 2, mr: 2 }} title="General Information" info="General information about the respective instance is noted under this section">
            <Grid container maxWidth="lg" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>Instance Name:</Typography>
                    <Typography>{instance.instance_name}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Stack justifyContent="flex-start" alignItems="flex-start">
                        <Typography variant="caption" color={'gray'}>IP Address:</Typography>
                        <Chip label={instance.ip_address} color="primary" />
                    </Stack>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>Project:</Typography>
                    <Typography>{instance.project}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>Status:</Typography>
                    <Typography>{instance.status}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>Version:</Typography>
                    <Typography>{instance.version.split('_').slice(1).join('.')}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>Location:</Typography>
                    <Typography>{instance.location}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>type:</Typography>
                    <Typography>{instance.type}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>create time:</Typography>
                    <Typography>{instance.create_time}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Typography variant="caption" color={'gray'}>instance type:</Typography>
                    <Typography>{instance.type}</Typography>
                </Grid>
            </Grid>
        </CoBaCard>
    )
}

export default InstanceGeneralInfoCard;
