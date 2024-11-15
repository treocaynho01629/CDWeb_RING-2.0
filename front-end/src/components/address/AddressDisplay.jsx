import styled from '@emotion/styled'
import { KeyboardArrowRight } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material'

//#region styled
const AddressDisplayContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    padding: 20px;

    &.error {
        border-color: ${props => props.theme.palette.error.main};
    }
`

const UserInfo = styled.b`
    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`
//#endregion

const AddressDisplay = ({ addressInfo, handleOpen, isValid, loadProfile }) => {

    return (
        <AddressDisplayContainer className={`${loadProfile ? '' : isValid ? '' : !addressInfo ? '' : 'error' }`}>
            <Box display="flex" flexDirection={'column'}>
                {(!addressInfo && loadProfile)
                    ?
                    <Box>Đang cập nhật...</Box>
                    :
                    <>
                        <Box display="flex" marginRight={2} whiteSpace={'nowrap'}>
                            <UserInfo>{addressInfo.name}&nbsp;</UserInfo>
                            {addressInfo?.phone && <UserInfo>{`(+84) ${addressInfo.phone}`}</UserInfo>}
                        </Box>
                        <Box>{addressInfo?.address}</Box>
                    </>
                }
            </Box>
            <Button
                sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap' }}
                aria-label="toggle address dialog"
                variant="outlined"
                color={!isValid ? "error" : "primary"}
                disabled={loadProfile}
                onClick={handleOpen}
            >
                Thay đổi
            </Button>
            <IconButton
                sx={{ display: { xs: 'block', sm: 'none' } }}
                aria-label="mobile toggle address dialog"
                onClick={handleOpen}
                color={!isValid ? "error" : "primary"}
                disabled={loadProfile}
                edge="end"
            >
                <KeyboardArrowRight />
            </IconButton>
        </AddressDisplayContainer>
    )
}

export default AddressDisplay