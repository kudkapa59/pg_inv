import { Grid, Typography, Chip, Stack } from '@mui/material'
import { Instance } from '../models/Instance';
import CoBaCard from './CoBaCard';
import { theme } from '../config/theme';

const InstanceLabels: React.FC<{ instance: Instance }> = ({ instance }) => {

    return (
        <CoBaCard sx={{ my: 2, p: 2, mr: 2 }} title="Labels" info="User defined labels set for this instance. Info: Not every instance must have the same labels.">

            {instance.labels && Object.entries(instance.labels).map(label => (
                <Chip
                    sx={{ pl: 0, m: '4px' }}
                    icon={<Chip style={{ marginLeft: 0, color: theme.palette.secondary.main, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} color="primary" label={label[0]} />}
                    label={label[1]}
                    variant="outlined"
                    color="primary"
                />
            ))}

            {/* <Grid container maxWidth="lg" spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                {instance.labels && Object.entries(instance.labels).map(label => (
                    <Grid item xs={12} sm={6} md={6}>
                        <Typography variant="caption" color={'gray'}>{label[0]}</Typography>
                        <Typography>{label[1]}</Typography>
                    </Grid>
                ))}
            </Grid> */}
        </CoBaCard>
    )
}

export default InstanceLabels;
