import styled from '@emotion/styled'
import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Button, FormControlLabel, Radio, RadioGroup, MenuItem, Skeleton, TextField, DialogContent, Avatar, Badge } from "@mui/material";
import { Check, Clear, EditOutlined, KeyboardArrowLeft, KeyboardArrowRight, Person } from "@mui/icons-material";
import { PHONE_REGEX } from "../../ultils/regex";
import { useUpdateProfileMutation } from "../../features/users/usersApiSlice";
import { Instruction, MobileExtendButton } from '../custom/GlobalComponents';
import { Link } from "react-router-dom";
import { StyledDialogTitle } from "../custom/ProfileComponents";
import dayjs from 'dayjs';
import useAuth from '../../hooks/useAuth';

const CustomDatePicker = lazy(() => import('../custom/CustomDatePicker'));

//#region styled
const TableContainer = styled.table`
    width: 100%;
    border-collapse: collapse;
`

const InfoText = styled.span`
    font-weight: 450;
    white-space: nowrap;

    &.edit {
        white-space: nowrap;
        margin-left: 15px;
        text-decoration: underline;
        cursor: pointer;
        color: ${props => props.theme.palette.primary.main};
    }

    &.disabled {
        pointer-events: none;
        color: ${props => props.theme.palette.action.disabled};
    }
`

const InfoRow = styled.tr`
    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 15px;
    }
`

const ProfilePic = styled.th`
    text-align: center;
    padding-left: 10px;
`

const ProfilePicContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const InfoTitle = styled.td`
    width: 27%;  
`

const InfoStack = styled.td`
    padding-left: 10px;
`

const InfoStackContainer = styled.div`
    position: relative;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    ${props => props.theme.breakpoints.down("sm")} {
        height: 48px;
    }
`

const BadgeButton = styled.span`
    display: flex;
    max-width: 100px;
    align-items: center;
    font-weight: 500;
    padding: 4px;
    border-radius: 50%;
    aspect-ratio: 1/1;
    font-size: 13px;
    justify-content: flex-end;
    color: ${props => props.theme.palette.common.black};
    background-color: ${props => props.theme.palette.grey[300]};
    border: 2px solid ${props => props.theme.palette.background.default};
    cursor: pointer;

    svg {
        font-size: 16px; 
        margin-right: 0; 
    }

    &.edit {
        &:hover {
            color: ${props => props.theme.palette.primary.main};
        }
    }

    &:hover {
        color: ${props => props.theme.palette.error.main};
        background-color: ${props => props.theme.palette.grey[200]};
        transition: .25s ease;
    }
`
//#endregion

const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'svg'], sizeLimit = 2_097_152; //2MB

const ProfileDetail = ({ pending, setPending, profile, loading, isSuccess, tabletMode }) => {
    //Initial value
    const { username } = useAuth();
    const inputFile = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);
    const [name, setName] = useState(profile?.name || '');
    const [dob, setDob] = useState(profile?.dob ? dayjs(profile?.dob) : dayjs('2000-01-01'));
    const [gender, setGender] = useState(profile?.gender || '');
    const [phone, setPhone] = useState(profile?.phone || '');
    const [validPhone, setValidPhone] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [editDob, setEditDob] = useState(false);
    const [pic, setPic] = useState(profile?.image || null);
    const [file, setFile] = useState(null);

    //Update profile hook
    const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

    //Set data
    useEffect(() => {
        if (!loading && isSuccess && profile) {
            setName(profile?.name);
            setPhone(profile?.phone);
            setGender(profile?.gender);
            setDob(dayjs(profile?.dob));
            setPic(profile?.image);
        }
    }, [profile])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone])

    const handleChangePic = (e) => {
        const { name: fileName, size: fileSize } = e.target.files[0];
        const fileExtension = fileName.split(".").pop();
        setErrMsg('');
        setErr([]);

        if (!allowedExtensions.includes(fileExtension)) {
            setErrMsg(`${fileName} sai định dạng ảnh!`);
        } else if (fileSize > sizeLimit) {
            setErrMsg(`${fileName} kích thước quá lớn!`);
        } else {
            setPic(URL.createObjectURL(e.target.files[0]));
            setFile(e.target.files[0]);
        }
    }

    const handleRemovePic = () => {
        setFile(null);
        if (pic == profile?.image) {
            setPic(null);
        } else {
            setPic(profile?.image);
        }
        setErrMsg('');
        setErr([]);
    }

    const handleClickBadge = () => {
        if (!profile?.image && !pic) {
            handleOpenFile();
        } else {
            handleRemovePic();
        }
    }

    const handleOpenFile = () => { inputFile.current.click(); }

    const handleChangeInfo = async (e) => {
        e.preventDefault();
        if (updating || pending) return;

        //Validation
        const valid = PHONE_REGEX.test(phone);
        if (!valid && phone) { return }

        setPending(true);
        const { enqueueSnackbar } = await import('notistack');

        //Set data
        const formData = new FormData();
        const json = JSON.stringify({
            name,
            phone,
            gender,
            dob: dob.format('YYYY-MM-DD'),
            address: profile?.address,
            image: file ? null : pic
        });
        const blob = new Blob([json], { type: 'application/json' });

        formData.append('request', blob);
        if (file) formData.append('image', file);

        updateProfile(formData).unwrap()
            .then((data) => {
                setErrMsg('');
                setErr([]);
                enqueueSnackbar('Cập nhật hồ sơ thành công!', { variant: 'success' });
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 400) {
                    setErrMsg('Sai định dạng thông tin!');
                } else {
                    setErrMsg('Cập nhật hồ sơ thất bại');
                }
                enqueueSnackbar('Cập nhật hồ sơ thất bại!', { variant: 'error' });
                setPending(false);
            })
    }

    return (
        <>
            <StyledDialogTitle>
                <Link to={'/profile/detail'}><KeyboardArrowLeft /></Link>
                <Person />&nbsp;Hồ sơ của bạn
            </StyledDialogTitle>
            <DialogContent sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: { xs: 1, md: 0 } }}>
                <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
                <TableContainer>
                    <tbody>
                        {tabletMode &&
                            <InfoRow>
                                <ProfilePic colSpan={3}>
                                    <ProfilePicContainer>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                                <BadgeButton
                                                    className={(!profile?.image && !pic) ? 'edit' : ''}
                                                    onClick={handleClickBadge}
                                                >
                                                    {(!profile?.image && !pic) ? <EditOutlined /> : <Clear />}
                                                </BadgeButton>
                                            }
                                        >
                                            <Avatar
                                                alt={name ?? 'Profile pic'}
                                                src={pic}
                                                sx={{ my: 2, width: 120, height: 120, cursor: 'pointer' }}
                                                onClick={handleOpenFile}
                                            />
                                        </Badge>
                                    </ProfilePicContainer>
                                </ProfilePic>
                            </InfoRow>
                        }
                        <InfoRow>
                            <InfoTitle><InfoText>Tên đăng nhập </InfoText></InfoTitle>
                            <InfoStack><InfoStackContainer>
                                {loading
                                    ?
                                    <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                    :
                                    <InfoText>{username}</InfoText>
                                }
                            </InfoStackContainer></InfoStack>
                            {!tabletMode &&
                                <ProfilePic rowSpan={3}>
                                    <ProfilePicContainer>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                            badgeContent={
                                                <BadgeButton
                                                    className={(!profile?.image && !pic) ? 'edit' : ''}
                                                    onClick={handleClickBadge}
                                                >
                                                    {(!profile?.image && !pic) ? <EditOutlined /> : <Clear />}
                                                </BadgeButton>
                                            }
                                        >
                                            <Avatar
                                                alt={name ?? 'Profile pic'}
                                                src={pic}
                                                sx={{ width: 120, height: 120, cursor: 'pointer' }}
                                                onClick={handleOpenFile}
                                            />
                                        </Badge>
                                    </ProfilePicContainer>
                                </ProfilePic>
                            }
                        </InfoRow>
                        <InfoRow>
                            <InfoTitle><InfoText>Email </InfoText></InfoTitle>
                            <InfoStack>
                                <InfoStackContainer>
                                    {loading
                                        ?
                                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="40%" />
                                        :
                                        <InfoText>{profile?.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")}</InfoText>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </InfoRow>
                        <InfoRow>
                            <InfoTitle><InfoText>Họ & Tên </InfoText></InfoTitle>
                            <InfoStack>
                                <InfoStackContainer>
                                    {loading
                                        ?
                                        <Skeleton variant="rectangular" height={40} width={'100%'} />
                                        :
                                        <TextField
                                            required
                                            placeholder="Nhập Họ và Tên"
                                            type="text"
                                            id="name"
                                            onChange={e => setName(e.target.value)}
                                            value={name}
                                            error={err?.data?.errors?.name}
                                            helperText={err?.data?.errors?.name}
                                            size="small"
                                            fullWidth
                                        />
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </InfoRow>
                        <InfoRow>
                            <InfoTitle><InfoText>Số điện thoại </InfoText></InfoTitle>
                            <InfoStack colSpan={2}>
                                <InfoStackContainer>
                                    {editPhone
                                        ?
                                        <TextField
                                            required
                                            id="phone"
                                            onChange={e => setPhone(e.target.value)}
                                            value={phone}
                                            error={phone && !validPhone || err?.data?.errors?.phone}
                                            helperText={phone && !validPhone ? "Sai định dạng số điện thoại!" : err?.data?.errors?.phone}
                                            size="small"
                                            fullWidth
                                        />
                                        :
                                        <>
                                            {loading
                                                ?
                                                <Skeleton variant="text" sx={{ fontSize: '16px' }} width="25%" />
                                                :
                                                <InfoText>{phone ? phone.replace(/\d(?=\d{2})/g, '*') : 'Chưa có'}</InfoText>
                                            }
                                            <InfoText className={`edit ${loading ? 'disabled' : ''}`} onClick={() => setEditPhone(true)}>Thay đổi</InfoText>
                                        </>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </InfoRow>
                        <InfoRow>
                            <InfoTitle><InfoText>Ngày sinh </InfoText></InfoTitle>
                            <InfoStack colSpan={2}>
                                <InfoStackContainer>
                                    {editDob ?
                                        <Suspense fallback={<>
                                            {loading ? <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                                : <InfoText>{dob.format('DD/MM/YYYY')}</InfoText>}
                                            <InfoText className={`edit ${loading ? 'disabled' : ''}`} onClick={() => setEditDob(true)}>Thay đổi</InfoText>
                                        </>}>
                                            <CustomDatePicker
                                                required
                                                value={dob}
                                                className="custom-date-picker"
                                                onChange={newValue => setDob(newValue)}
                                                size="small"
                                                slotProps={{
                                                    textField: {
                                                        size: "small",
                                                        fullWidth: true,
                                                        error: err?.data?.errors?.dob,
                                                        helperText: err?.data?.errors?.dob,
                                                    },
                                                }}
                                            />
                                        </Suspense>
                                        :
                                        <>
                                            {loading ? <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                                : <InfoText>{dob.format('DD/MM/YYYY')}</InfoText>}
                                            <InfoText className={`edit ${loading ? 'disabled' : ''}`} onClick={() => setEditDob(true)}>Thay đổi</InfoText>
                                        </>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </InfoRow>
                        <InfoRow>
                            <InfoTitle><InfoText>Giới tính </InfoText></InfoTitle>
                            <InfoStack colSpan={2}>
                                <InfoStackContainer>
                                    {tabletMode ?
                                        loading ? <Skeleton variant="rectangular" height={40} width="100%" />
                                            :
                                            <TextField
                                                required
                                                select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                size="small"
                                                fullWidth
                                            >
                                                <MenuItem value="Nam">Nam</MenuItem>
                                                <MenuItem value="Nữ">Nữ</MenuItem>
                                                <MenuItem value="">Không</MenuItem>
                                            </TextField>

                                        :
                                        loading ?
                                            <>
                                                <Skeleton variant="text" width={75} sx={{ fontSize: 14, mr: 2 }} />
                                                <Skeleton variant="text" width={75} sx={{ fontSize: 14, mr: 2 }} />
                                                <Skeleton variant="text" width={75} sx={{ fontSize: 14 }} />
                                            </>
                                            :
                                            <RadioGroup
                                                spacing={1}
                                                row
                                                value={gender}
                                                onChange={e => setGender(e.target.value)}
                                            >
                                                <FormControlLabel value="Nam" control={<Radio color="primary" />} label="Nam" />
                                                <FormControlLabel value="Nữ" control={<Radio color="primary" />} label="Nữ" />
                                                <FormControlLabel value="" control={<Radio color="primary" />} label="Không" />
                                            </RadioGroup>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </InfoRow>
                        {tabletMode &&
                            <>
                                <InfoRow>
                                    <InfoTitle><InfoText>Sổ địa chỉ </InfoText></InfoTitle>
                                    <InfoStack>
                                        <Link to={'/profile/detail/address'}>
                                            <InfoStackContainer>
                                                <MobileExtendButton>
                                                    <KeyboardArrowRight fontSize="small" />
                                                </MobileExtendButton>
                                            </InfoStackContainer>
                                        </Link>
                                    </InfoStack>
                                </InfoRow>
                                <InfoRow>
                                    <InfoTitle><InfoText>Thiết lập mật khẩu </InfoText></InfoTitle>
                                    <InfoStack>
                                        <Link to={'/profile/detail/password'}>
                                            <InfoStackContainer>
                                                <MobileExtendButton>
                                                    <KeyboardArrowRight fontSize="small" />
                                                </MobileExtendButton>
                                            </InfoStackContainer>
                                        </Link>
                                    </InfoStack>
                                </InfoRow>
                            </>
                        }
                    </tbody>
                </TableContainer>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    onClick={handleChangeInfo}
                    sx={{ mt: 2, mb: 4 }}
                    startIcon={<Check />}
                >
                    Lưu thông tin
                </Button>
            </DialogContent>
            <input
                type="file"
                id="fileInput"
                accept="image/*"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleChangePic}
            />
        </>
    )
}

export default ProfileDetail