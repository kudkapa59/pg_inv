import { IconButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import MuiMenu from '@mui/material/Menu';
import MuiLink from '@mui/material/Link';
import TimelineIcon from '@mui/icons-material/Timeline';
import ForumIcon from '@mui/icons-material/Forum';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

interface MoreInfosProps {
    supportLink: string;
    appVersion: string;
}

const MoreInfos: React.FC<MoreInfosProps> = (props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    return (
        <div>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                color="inherit"
            >
                <MoreVert />
            </IconButton>
            <MuiMenu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem component={MuiLink} href={props.supportLink}>
                    <ListItemIcon>
                        <ForumIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Support kontaktieren</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                        <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Version {props.appVersion}</ListItemText>
                </MenuItem>
            </MuiMenu>
        </div>
    );
};

export default MoreInfos;
