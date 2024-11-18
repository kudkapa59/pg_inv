import { Grid, Typography, Chip, Stack } from '@mui/material'
import { Instance } from '../models/Instance';
import CoBaCard from './CoBaCard';
import BackupIcon from '@mui/icons-material/Backup';
import SaveIcon from '@mui/icons-material/Save';
import StorageIcon from '@mui/icons-material/Storage';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MemoryIcon from '@mui/icons-material/Memory';

function isCustom(name: string) {
    return name.startsWith('db-custom-');
}

function extractCPUsFromName(name: string) {
    if (isCustom(name)) {
        return name.split('-')[2]
    }
    return name;
}

function extractMemoryFromName(name: string) {
    if (isCustom(name)) {
        return name.split('-')[3]
    }
    return name;
}

const InstanceResourcesCard: React.FC<{ instance: Instance }> = ({ instance }) => {
    return (
        <CoBaCard title="Resources" info="This card displays information about the used resources of the instance.">
            <Grid container maxWidth="lg" spacing={2} columns={{ xs: 5, sm: 5, md: 5 }}>
                <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" color={'gray'}>CPUs</Typography>
                    <MemoryIcon sx={{ fontSize: 70 }} />
                    <Typography ><b>{extractCPUsFromName(instance.cpu)}</b></Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" color={'gray'}>Memory</Typography>
                    <SaveIcon sx={{ fontSize: 70 }} />
                    <Typography ><b>{isCustom(instance.mem_mb) ? extractMemoryFromName(instance.mem_mb) + '(MB)' : instance.mem_mb} </b></Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" color={'gray'}>Disk Storage</Typography>
                    <StorageIcon sx={{ fontSize: 70 }} />
                    <Typography ><b>{instance.disk_size_gb}(GB)</b></Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack alignItems="center">
                        <Typography variant="caption" color={'gray'}>Replicas</Typography>
                        <AccountTreeIcon sx={{ fontSize: 70 }} />
                        <Chip label={instance.replicas ? 'on' : 'off'} color={instance.replicas ? 'success' : 'error'} />
                    </Stack>
                </Grid>
                <Grid item xs={1} sm={1} md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack alignItems="center">
                        <Typography variant="caption" color={'gray'}>Backup</Typography>
                        <BackupIcon sx={{ fontSize: 70 }} />
                        <Chip label={instance.backups ? 'on' : 'off'} color={instance.backups ? 'success' : 'error'} />
                    </Stack>
                </Grid>
            </Grid>
        </CoBaCard>
    )
}

export default InstanceResourcesCard;
