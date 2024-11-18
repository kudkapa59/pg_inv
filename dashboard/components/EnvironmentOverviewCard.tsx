import { Grid, Alert } from '@mui/material'
import CoBaCard from './CoBaCard';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js'
import useCountEnvs from '../hooks/CountEnvsHook';

Chart.register(ArcElement, Tooltip);

const EnvironmentOverviewCard: React.FC = () => {

    const { loading, error, value } = useCountEnvs();
    const envData = {
        datasets: [{
            data: value?.map(v => v.count),
            backgroundColor: [
                'rgb(255, 205, 86)',
                '#f25239',
                '#14ae5c',
                'rgb(54, 162, 235)',
            ],
            hoverOffset: 4
        }],
        labels: value?.map(v => v.env) ?? [],
    }

    if (error) {
        return (<CoBaCard title="Environment Overview">
            <Alert severity="error">Error while loading the information.</Alert>
        </CoBaCard>)
    }

    return (
        <CoBaCard title="Environment Overview">
            {loading ? <Alert severity="info">loading...</Alert> :
                <Grid sx={{ mt: 2 }} container spacing={2} columns={{ xs: 2, sm: 2, md: 2 }}>
                    <Grid item xs={1} sm={1} md={1}>
                        <Doughnut data={envData} />
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        This card shows how many instances are running in which environment. Currently there are
                        <b> {envData?.datasets[0].data?.reduce((curr, prev) => (Number(curr) + Number(prev)))} </b>
                        instances present.
                        <ul>
                            {envData?.datasets[0].data?.map((entry, index) => (
                                <li key={index}>
                                    <div style={{ display: 'flex', alignItems: 'center', height: '25px' }}>
                                        <div style={{ backgroundColor: envData.datasets[0].backgroundColor[index], height: '20px', width: '20px', display: 'inline-block', marginRight: '10px' }} />
                                        {envData.labels[index]}: {entry}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Grid>
                </Grid>
            }
        </CoBaCard>
    )
}

export default EnvironmentOverviewCard;
