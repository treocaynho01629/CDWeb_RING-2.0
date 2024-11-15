import { styled } from '@mui/material';
import { Tab, Tabs } from '@mui/material';

const StyledTab = styled((props) => <Tab {...props} />)(
    ({ theme }) => ({
        fontWeight: 500,
        textTransform: 'none',

        '&.MuiTab-root': {
            minHeight: 44,
            height: 44,
        },
    }),
);

const StyledTabs = styled((props) => <Tabs {...props} />)(
    ({ theme }) => ({
        '&.MuiTabs-root': {
            minHeight: 44,
            height: 44,
        },
        '& .MuiTabs-indicator': {
            height: '2.2px',
        },
    }),
);

export const CustomTab = (props) => {
    return (<StyledTab {...props} />)
}

export const CustomTabs = (props) => {
    return (<StyledTabs {...props} />)
}