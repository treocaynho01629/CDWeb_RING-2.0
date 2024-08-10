import { useEffect } from 'react';
import styled from 'styled-components'

import Grid from "@mui/material/Grid"

import {useDropzone} from 'react-dropzone';

//#region styled
const DropZoneContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d6e2db;
    height: 350px;
    cursor: pointer;
    border: 5px dashed ${props => props.theme.palette.primary.main};
`

const ThumbContainer = styled.div`
    display: flex;
    height: 350px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #d6e2db;
`

const Thumb = styled.div`
    display: flex;
    border: 1px solid #eaeaea;
    height: 350px;
    width: 100%;
    padding: 4px;
    box-sizing: border-box;
    justify-content: center;
`

const ThumbInner = styled.div`
    display: flex;
    min-width: 0;
    overflow: hidden;
    justify-content: center;
`

const ThumbImage = styled.img`
    display: block;
    height: 100%;
    width: 100%;
    object-fit: cover;
`
//#endregion

const CustomDropZone = (props) => {
    const { image, files, setFiles } = props;
    const {getRootProps, getInputProps, fileRejections} = useDropzone({
        maxFiles: 1,
        maxSize: 2000000,
        multiple: false,
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
      <b style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'red'}}>
        File: {file.path} - {file.size} bytes Quá lớn
      </b>
    ));

  let thumbs

  if (files?.length != 0) {
    thumbs = files.map(file => (
      <Thumb key={file.name}>
        <ThumbInner>
          <ThumbImage
            src={file.preview}
            onLoad={() => { URL.revokeObjectURL(file.preview) }}
          />
        </ThumbInner>
      </Thumb>
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
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
                <DropZoneContainer {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                      <p>Thả hoặc click vào để tải ảnh</p>
                      <b>(Tối đa 2MB)</b>
                      {fileRejectionItems}
                    </div>
                </DropZoneContainer>
            </Grid>
            <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <ThumbContainer>
                    {thumbs}
                </ThumbContainer>
            </Grid>
        </Grid>
    </section>
  );
}

export default CustomDropZone;