import styled from 'styled-components'
import { KeyboardArrowDown, KeyboardArrowRight, LocalShippingOutlined } from '@mui/icons-material';
import { Box } from '@mui/material'
import { MobileExtendButton } from '../custom/GlobalComponents';

//#region styled
const PreviewWrapper = styled.div`
    position: relative;
    margin: 20px 0;

    ${props => props.theme.breakpoints.down("md")} {
        margin: 0;
    }
`

const PreviewContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const DetailTitle = styled.h4`
    margin: 10px 0;
    font-size: 16px;
    font-weight: 600;

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`

const Address = styled.span`
    text-decoration: underline;
    white-space: wrap;
    font-weight: 450;

    ${props => props.theme.breakpoints.down("md")} {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const AddressInfo = styled.span`
    font-size: 14px;
    display: flex;
    white-space: nowrap;
    cursor: pointer;

    ${props => props.theme.breakpoints.down("md")} {
        overflow: hidden;
        text-overflow: ellipsis;
        align-items: center;
        width: 100%;

        &.hide-on-mobile { display: none}
    }
`
//#endregion

const AddressPreview = ({ addressInfo, handleOpen, loadProfile }) => {

    return (
        <PreviewWrapper>
            <DetailTitle>Vận chuyển:</DetailTitle>
            <PreviewContainer>
                <Box display="flex" flexDirection={'column'} position="relative" width="100%">
                    {(!addressInfo && loadProfile)
                        ?
                        <Box>Đang cập nhật...</Box>
                        :
                        <Box display="flex" width={{ xs: '95%', md: '100%' }}>
                            <LocalShippingOutlined />
                            <Box overflow="hidden">
                                <AddressInfo
                                    aria-label="toggle address dialog"
                                    disabled={loadProfile}
                                    onClick={handleOpen}
                                >
                                    &nbsp;Vận chuyển tới:&emsp;
                                    <Address>
                                        {addressInfo?.address ? addressInfo?.address : 'Không xác định'}
                                    </Address>
                                    <KeyboardArrowDown sx={{ display: { xs: 'none', md: 'block' } }} />
                                </AddressInfo>
                                <AddressInfo className="hide-on-mobile">&nbsp;Phí vận chuyển:&emsp;<Address>10,000đ</Address></AddressInfo>
                            </Box>
                        </Box>
                    }
                </Box>
                <MobileExtendButton disabled={loadProfile} onClick={handleOpen}>
                    <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
            </PreviewContainer>
        </PreviewWrapper>
    )
}

export default AddressPreview