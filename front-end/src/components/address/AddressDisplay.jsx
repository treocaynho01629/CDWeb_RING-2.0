import styled from '@emotion/styled'
import { KeyboardArrowRight, LocalShippingOutlined, RocketLaunchOutlined, SavingsOutlined } from '@mui/icons-material';
import { alpha, Button, FormControlLabel, IconButton, Radio, RadioGroup } from '@mui/material'
import { useState } from 'react';
import { getAddress } from '../../ultils/address';

//#region styled
const Title = styled.h4`
    margin: ${props => props.theme.spacing(1.5)} ${props => props.theme.spacing(1)};
    font-weight: 420;
`

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

const FormContent = styled.div`
    width: 100%;
`

const StyledForm = styled(FormControlLabel)`
    padding: ${props => props.theme.spacing(1.5)} ${props => props.theme.spacing(2)};
    padding-left: 0;
    border: .5px solid ${props => props.theme.palette.divider};
    min-width: 50%;
    margin: ${props => props.theme.spacing(.5)} 0;

    .MuiFormControlLabel-label {
        position: relative;
        width: 100%;
    };

    &:has(input[type="radio"]:checked) {
        border-color: ${props => props.theme.palette.primary.main};
        background-color: ${props => alpha(props.theme.palette.primary.light, 0.1)};
    }
`

const ItemContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
`

const ItemTitle = styled.div`
    display: flex;
    align-items: center;
    
    svg {
        font-size: 24px;
        margin-right: ${props => props.theme.spacing(.5)};
    }
`

const Estimate = styled.span`
    font-size: 12px;
    color: ${props => props.theme.palette.text.secondary};
`

const AddressContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const AddressContent = styled.div`
    display: flex;
    margin-right: ${props => props.theme.spacing(2)};
    white-space: nowrap;
`

const Address = styled.span`
    font-size: 16px;
    line-height: 1.75em;
    margin-top: ${props => props.theme.spacing(1)};
    color: ${props => props.theme.palette.text.secondary};
`

const AddressTag = styled.span`
    font-size: 12px;
    font-weight: bold;
    margin-right: ${props => props.theme.spacing(.5)};
    padding: ${props => props.theme.spacing(.5)} ${props => props.theme.spacing(1)};
    border: .5px solid ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.main};

    &.info {
        color: ${props => props.theme.palette.info.main};
        border-color: ${props => props.theme.palette.info.main};
    }
`
//#endregion

const AddressDisplay = ({ addressInfo, handleOpen, isValid, loadAddress }) => {
    const [delivery, setDelivery] = useState('Tiêu chuẩn');
    const fullAddress = [addressInfo?.city, addressInfo?.address].join(", ");

    const handleChange = (e) => { setDelivery(e.target.value) }
    const address = addressInfo?.type ? getAddress(addressInfo.type) : null;

    return (
        <>
            <Title>Giao tới</Title>
            <AddressDisplayContainer className={loadAddress ? '' : isValid ? '' : !addressInfo ? '' : 'error'}>
                <AddressContainer>
                    {(!addressInfo && loadAddress)
                        ?
                        <Address>Đang cập nhật...</Address>
                        :
                        <>
                            <AddressContent>
                                <UserInfo>{addressInfo?.companyName ?? addressInfo?.name}&nbsp;</UserInfo>
                                {addressInfo?.phone && <UserInfo>{`(+84) ${addressInfo.phone}`}</UserInfo>}
                            </AddressContent>
                            <Address>
                                {address && <AddressTag className={address.color}>{address.label}</AddressTag>}
                                {fullAddress.length > 2 ? fullAddress : 'Không xác định'}
                            </Address>
                        </>
                    }
                </AddressContainer>
                <Button
                    sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap' }}
                    aria-label="toggle address dialog"
                    variant="outlined"
                    color={!isValid ? "error" : "primary"}
                    disabled={loadAddress}
                    onClick={handleOpen}
                >
                    Thay đổi
                </Button>
                <IconButton
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                    aria-label="mobile toggle address dialog"
                    onClick={handleOpen}
                    color={!isValid ? "error" : "primary"}
                    disabled={loadAddress}
                    edge="end"
                >
                    <KeyboardArrowRight />
                </IconButton>
            </AddressDisplayContainer>
            <Title>Hình thức giao hàng</Title>
            <RadioGroup value={delivery} onChange={handleChange}>
                <StyledForm value="Tiết kiệm" control={<Radio />}
                    label={<FormContent>
                        <ItemContent>
                            <ItemTitle><SavingsOutlined />Tiết kiệm</ItemTitle>
                            <b>10,000đ</b>
                        </ItemContent>
                        <Estimate>5-7 ngày</Estimate>
                    </FormContent>} />
                <StyledForm value="Tiêu chuẩn" control={<Radio />}
                    label={<FormContent>
                        <ItemContent>
                            <ItemTitle><LocalShippingOutlined />Tiêu chuẩn</ItemTitle>
                            <b>10,000đ</b>
                        </ItemContent>
                        <Estimate>2-4 ngày</Estimate>
                    </FormContent>} />
                <StyledForm value="Hoả tốc" control={<Radio />}
                    label={<FormContent>
                        <ItemContent>
                            <ItemTitle><RocketLaunchOutlined />Hoả tốc</ItemTitle>
                            <b>10,000đ</b>
                        </ItemContent>
                        <Estimate>1-2 ngày</Estimate>
                    </FormContent>} />
            </RadioGroup>
        </>
    )
}

export default AddressDisplay