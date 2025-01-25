import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { AddAPhoto, Clear } from '@mui/icons-material';
import { Badge } from '@mui/material';

//#region styled
const getColor = (props) => {
  if (props.isDragAccept) {
    return props.theme.palette.success.main;
  }
  if (props.isDragReject) {
    return props.theme.palette.error.main;
  }
  if (props.isFocused) {
    return props.theme.palette.info.main;
  }
  return props.theme.palette.divider;
}

const CustomBadge = styled(Badge)`
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: inherit;
`

const AvatarPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    background-color: ${props => props.theme.palette.action.focus};
    color: ${props => props.theme.palette.text.secondary};
    font-size: 14px;
    opacity: .8;
    transition: all .2s ease;
`

const AvatarContent = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    overflow: hidden;
`

const Avatar = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    overflow: hidden;
    z-index: 1;
    transition: all .2s ease;
`

const AvatarContainer = styled.div`
    position: relative;
    height: 150px;
    width: 150px;
    padding: ${props => props.theme.spacing(1)};
    border-radius: 50%;
    border: 1px dashed;
    border-color: ${props => getColor(props)};
    cursor: pointer;

    &:hover {
      ${AvatarPlaceholder} {
        opacity: 1;
        background-color: ${props => props.theme.palette.action.hover};
      }

      ${Avatar} {
        opacity: .5;
      }
    }
`

const Instruction = styled.p`
    width: 100%;
    margin-bottom: 0;
    font-size: 14px;
    color: ${props => props.theme.palette.text.secondary};
    text-align: center;
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
    background-color: ${props => props.theme.palette.background.paper};
    border: 3px solid ${props => props.theme.palette.divider}; 
    z-index: 3;
    cursor: pointer;

    svg {
        font-size: 16px; 
        margin-right: 0; 
    }

    &:hover {
        color: ${props => props.theme.palette.error.main};
        transition: .2s ease;
    }
`
//#endregion

const CustomAvatarSelect = ({ image, handleRemoveImage, file, setFile }) => {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    multiple: false,
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFile(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => file.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  let avatar;

  if (file?.length != 0) {
    avatar = <Avatar
      src={file[0].preview}
      onLoad={() => { URL.revokeObjectURL(file[0].preview) }}
    />
  } else if (image) {
    avatar = <Avatar src={image} />
  }

  return (
    <section className="container">
      <AvatarContainer {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <CustomBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          invisible={!image && !file?.length}
          badgeContent={
            <BadgeButton onClick={handleRemoveImage}>
              <Clear />
            </BadgeButton>
          }
        >
          <AvatarContent>
            <AvatarPlaceholder>
              <AddAPhoto fontSize="large" />
              Tải ảnh
            </AvatarPlaceholder>
            {avatar}
          </AvatarContent>
        </CustomBadge>
      </AvatarContainer>
      <Instruction>Tối đa 2MB</Instruction>
    </section>
  );
}

export default CustomAvatarSelect;