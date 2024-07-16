import { styled } from '@mui/material/styles';
import { LinearProgress } from "@mui/material";

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    backgroundColor: 'transparent',
}));

export default function CustomProgress(props) {
    return (
        <div style={{ height: '20px', width: '100%', position: 'absolute', top: 5, left: 0, zIndex: 9 }}>
            <CustomLinearProgress {...props} />
        </div>
    )
}