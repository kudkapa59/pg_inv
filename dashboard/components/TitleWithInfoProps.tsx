import { IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, SxProps, Theme } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ReactNode, useState } from 'react';

interface TitleWithInfoProps {
  infoTitle?: string;
  infoContent?: ReactNode;
  sx?: SxProps<Theme>;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit';
  children?: React.ReactNode;
}

const TitleWithInfo: React.FC<TitleWithInfoProps> = (props) => {
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);

  return (
    <>
      <Typography variant={props.variant? props.variant : 'h5'} sx={props.sx}>
        {props.children}
        {props.infoContent && (
          <IconButton aria-label="delete" onClick={() => setOpenInfoDialog(true)}>
            <InfoOutlinedIcon />
          </IconButton>
        )}
      </Typography>
      {props.infoContent && (
        <Dialog fullWidth={true} maxWidth={'sm'} open={openInfoDialog} onClose={() => setOpenInfoDialog(false)}>
          <DialogTitle>{props.infoTitle ? props.infoTitle : 'Info'}</DialogTitle>
          <DialogContent>{props.infoContent}</DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TitleWithInfo;
