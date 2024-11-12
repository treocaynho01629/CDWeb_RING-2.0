import { LinearProgress } from "@mui/material";

export default function CustomProgress(props) {
    return (
        <div style={{ height: '4px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 9 }}>
            <LinearProgress {...props}/>
        </div>
    )
}