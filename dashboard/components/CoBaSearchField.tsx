import { TextField, InputAdornment, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';

interface CoBaSearchFieldProps {
    placeholder?: string,
    defaultValue?: string;
    loading?: boolean;
    infoTest?: string;
    onChange?: (newVal: string) => any;
}

const CoBaSearchField: React.FC<CoBaSearchFieldProps> = (props) => {
    let typingTimer: NodeJS.Timeout;
    const typeInterval = 400; // in ms
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [value, setValue] = useState(props.defaultValue ?? '');

    return (
        <>
            <TextField
                fullWidth
                id="fullWidth"
                label="Search"
                placeholder={props.placeholder}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={() => clearTimeout(typingTimer)}
                onKeyUp={e => {
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(() => {
                        props.onChange?.(value);
                    }, typeInterval);
                }}
                InputProps={props.loading ? {
                    endAdornment: (
                        <InputAdornment position="end">
                            <CircularProgress />
                            <IconButton edge="end" onClick={() => setOpenInfoDialog(true)} >
                                <InfoOutlinedIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                } : {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton edge="end" onClick={() => setOpenInfoDialog(true)} >
                                    <InfoOutlinedIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
            />
            <Dialog fullWidth={true} maxWidth={'sm'} open={openInfoDialog} onClose={() => setOpenInfoDialog(false)}>
                <DialogTitle>{'Info'}</DialogTitle>
                <DialogContent>{props.infoTest ?? 'Using the Search you can filter the resultset to only return results that match your search.'}</DialogContent>
            </Dialog>
        </>
    )
}

export default CoBaSearchField
