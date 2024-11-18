import { Card, Container, Divider, SxProps, Theme } from '@mui/material'
import TitleWithInfo from './TitleWithInfoProps';

interface CoBaCardProps {
    title?: string;
    info?: string;
    children?: React.ReactNode;
    sx?: SxProps<Theme>;
}

const CoBaCard: React.FC<CoBaCardProps> = (props) => {
    return (
        <Card sx={props.sx ?? { p: 2 }} >
            <TitleWithInfo
                infoTitle={props.title}
                infoContent={props.info}
            >{props.title}</TitleWithInfo>
            <Divider sx={{ my: 1 }}></Divider>
            {props.children}
        </Card>
    )
}

export default CoBaCard
