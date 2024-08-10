import styled from 'styled-components'
import { KeyboardArrowRight, MoreHoriz } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material'
import { PHONE_REGEX } from '../../ultils/regex';
import CustomButton from '../custom/CustomButton';

//#region styled
const AddressItemContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    border: 0.5px solid ${props => props.theme.palette.action.focus};

    &.active {
        border-color: ${props => props.theme.palette.primary.main};
    }

    &.error {
        border-color: ${props => props.theme.palette.error.main};
    }
`

const AddressTag = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    font-weight: bold;
    font-size: 12px;
    padding: 2px 10px;
    border-right: .5px solid;
    border-bottom: .5px solid;
    border-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.dark};
    pointer-events: none;

    &.error {
        border-color: ${props => props.theme.palette.error.main};
        color: ${props => props.theme.palette.error.dark};
    }
`

const UserInfo = styled.b`
    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`
//#endregion

const AddressItem = ({ addressInfo, handleOpen, handleClick, selectedValue }) => {
    const isValid = () => {
        if (!addressInfo) return false;

        const { name, phone } = addressInfo;
        let addressSplit = addressInfo?.address.split(', ');
        let address = addressSplit[addressSplit.length - 1];
        let city = '';
        let ward = '';
        if (addressSplit.length > 1) city = addressSplit[0];
        if (addressSplit.length > 2) ward = addressSplit[1];
        if (addressSplit.length > 3) address = addressSplit.slice(2, addressSplit.length).join(', ');

        const result = !(!name || !phone || !address || !city || !ward || !PHONE_REGEX.test(phone));
        return result;
    }
    const isNotValid = !isValid();
    const isDefault = (addressInfo != null && addressInfo?.id == null);
    const isSelected = (selectedValue != null && selectedValue == addressInfo?.id);

    return (
        <AddressItemContainer className={`${isNotValid ? 'error' : isDefault ? 'active' : ''}`}>
            {isDefault && <AddressTag className={`${isNotValid ? 'error' : ''}`}>Mặc định</AddressTag>}
            <Box display={'flex'} flexDirection={'column'}>
                <Box display={'flex'} marginRight={2} whiteSpace={'nowrap'}>
                    <UserInfo>{addressInfo.name}&nbsp;</UserInfo>
                    {addressInfo?.phone && <UserInfo>{`(+84) ${addressInfo.phone}`}</UserInfo>}
                </Box>
                <Box>{addressInfo?.address}</Box>
            </Box>
            <CustomButton
                sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', marginTop: 2 }}
                aria-label="toggle address dialog"
                variant="outlined"
                color={isNotValid ? "error" : "secondary"}
                onClick={() => handleOpen(addressInfo)}
            >
                Thay đổi
            </CustomButton>
            <IconButton
                sx={{ display: { xs: 'block', sm: 'none' } }}
                aria-label="mobile toggle address dialog"
                onClick={() => handleOpen(addressInfo)}
                edge="end"
            >
                <KeyboardArrowRight />
            </IconButton>
            {(!isDefault && !isSelected) &&
                <IconButton
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        position: 'absolute',
                        top: 1,
                        right: 2
                    }}
                    onClick={(e) => handleClick(e, addressInfo)}
                >
                    <MoreHoriz />
                </IconButton>
            }
        </AddressItemContainer>
    )
}

export default AddressItem