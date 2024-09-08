import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import { Close, PermMedia } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

//#region styled
const DropZoneContainer = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 250px;
    background-color: ${props => props.theme.palette.action.focus};
    border: 2px dashed ${props => props.theme.palette.primary.main};
    cursor: pointer;
`

const DropZoneContent = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ThumbContainer = styled('aside')`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 16px 0px;
`

const Thumb = styled('div')`
    display: flex;
    border: .5px solid ${props => props.theme.palette.action.focus};
    height: 80px;
    width: 80px;
    margin-right: 5px;
    box-sizing: border-box;
    justify-content: center;
    position: relative;
`

const ThumbInner = styled('div')`
    display: flex;
    min-width: 0;
    overflow: hidden;
    justify-content: center;
`

const ThumbImage = styled('img')`
    display: block;
    width: auto;
    height: 100%;
    object-fit: cover;
`

const StyledIconButton = styled(IconButton)`
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 5px;
    padding: 2px;
    color: white;
    background-color: #0000008b;

    &:hover {
      background-color: #000000bc;
    }

    svg { font-size: 15px }
`
//#endregion

const CustomDropZone = ({ image, files, setFiles }) => {
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    maxFiles: 10,
    maxSize: 2000000,
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <b style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'red' }}>
      File: {file.path} - {file.size} bytes Quá lớn
    </b>
  ));

  let thumbs

  if (files?.length != 0) {
    thumbs = files.map((file, index) => (
      <Tooltip key={`${file.name}-${index}`} title={file.name}>
        <Thumb>
            <StyledIconButton><Close /></StyledIconButton>
            <ThumbInner>
              <ThumbImage
                src={file.preview}
                onLoad={() => { URL.revokeObjectURL(file.preview) }}
              />
            </ThumbInner>
        </Thumb>
      </Tooltip>
    ));
  } else {
    thumbs =
      <Thumb>
        <ThumbInner>
          <ThumbImage
            src={image}
          />
        </ThumbInner>
      </Thumb>
  }

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container">
      <DropZoneContainer {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <DropZoneContent>
          <PermMedia fontSize="large" />
          <h3 style={{ margin: 0, marginTop: 10 }}>Kéo thả hoặc chọn file ảnh</h3>
          <span>(Tối đa 2MB, 10 ảnh)</span>
          {fileRejectionItems}
        </DropZoneContent>
      </DropZoneContainer>
      <ThumbContainer>
        {thumbs}
      </ThumbContainer>
    </section>
  );
}

export default CustomDropZone;