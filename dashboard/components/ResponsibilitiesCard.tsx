import { Stack, Avatar, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Alert, IconButton, Chip } from '@mui/material'
import CoBaCard from './CoBaCard';
import { Responsibility } from '../models/Responsibility';
import MailIcon from '@mui/icons-material/Mail';

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0],
    };
}

const ResponsibilitiesCard: React.FC<{ responsibilites: Responsibility[] }> = ({ responsibilites }) => {


    if (!responsibilites || responsibilites.length == 0) {
        return (
            <CoBaCard title="Responsibilities" info="This card displays information about the responsible customer that owns this instance.">
                <Alert severity="error">No responsibilities found!</Alert>
            </CoBaCard>
        );
    }

    return (
        <CoBaCard title="Responsibilities" info="This card displays information about the responsible customer that owns this instance.">
            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Comsi ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="center">E-Mail</TableCell>
                            <TableCell align="left">Role</TableCell>
                            <TableCell align="left">Department</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {responsibilites.map((responsibility, index) => (
                            <TableRow key={index} >
                                <TableCell align="left"><Typography>{responsibility.user_id}</Typography></TableCell>
                                <TableCell align="left"><Stack direction="row" spacing={2} alignItems="center">
                                    {responsibility.name != null ?
                                        <Avatar {...stringAvatar(responsibility.name)} title={responsibility.name} /> :
                                        <Chip label="Undefined Value" color="warning" />
                                    }
                                    <Typography>{responsibility.name}</Typography>
                                </Stack>
                                </TableCell>
                                <TableCell align="center">
                                    {responsibility.name != null &&
                                        <IconButton color="primary" aria-label="add an alarm" href={`mailto:${responsibility.email}`}>
                                            <MailIcon />
                                        </IconButton>
                                    }
                                </TableCell>
                                <TableCell align="left"><Typography>{responsibility.type_key}</Typography></TableCell>
                                <TableCell align="left"><Typography>{responsibility.department}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </CoBaCard>
    )
}

export default ResponsibilitiesCard;
