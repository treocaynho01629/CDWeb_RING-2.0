import styled from '@emotion/styled'
import { KeyboardArrowRight, MoreHoriz } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material'
import { PHONE_REGEX } from '../../ultils/regex';

//#region styled
const AddressItemContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    border: 0.5px solid ${props => props.theme.palette.action.focus};

    &.active { border-color: ${props => props.theme.palette.primary.main};}
    &.error {border-color: ${props => props.theme.palette.error.main};}
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
    display: flex;
    white-space: nowrap;
    margin-right: 16px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`

const UserAddress = styled.span`
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
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
            <Box display="flex" flexDirection={'column'}>
                {!addressInfo ?
                    <>
                        <UserInfo>Chưa có địa chỉ mặc định</UserInfo>
                        <UserAddress>Tạo địa chỉ tạm thời?</UserAddress>
                    </>
                    :
                    <>
                        <UserInfo>{addressInfo?.name}&nbsp;
                            {addressInfo?.phone && `(+84) ${addressInfo?.phone}`}
                        </UserInfo>
                        <UserAddress>{addressInfo?.address}</UserAddress>
                    </>
                }
            </Box>
            <Button
                sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', marginTop: 2 }}
                aria-label="toggle address dialog"
                variant="outlined"
                color={isNotValid ? "error" : "primary"}
                onClick={() => handleOpen(addressInfo)}
            >
                Thay đổi
            </Button>
            <IconButton
                sx={{ display: { xs: 'block', sm: 'none' } }}
                aria-label="mobile toggle address dialog"
                onClick={() => handleOpen(addressInfo)}
                color={isNotValid ? "error" : "primary"}
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