import React, {useEffect} from 'react';
import styled from 'styled-components'

import Grid from "@mui/material/Grid"

import {useDropzone} from 'react-dropzone';

const DropZoneContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d6e2db;
    height: 350px;
    cursor: pointer;
    border: 5px dashed #63e399;
`

const ThumbContainer = styled.div`
    display: flex;
    height: 350px;
    flex-direction: row;
    flex-wrap: wrap;
`

const Thumb = styled.div`
    display: inline-flex;
    border: 1px solid #eaeaea;
    height: 350px;
    margin-right: 8px;
    padding: 4px;
    box-sizing: border-box;
`

const ThumbInner = styled.div`
    display: flex;
    min-width: 0;
    overflow: hidden;
`

const ThumbImage = styled.img`
    display: block;
    width: auto;
    height: 100%;
`

const CustomDropZone = (props) => {
    const { image, files, setFiles } = props;
    const {getRootProps, getInputProps} = useDropzone({
        maxFiles:1,
        accept: {
        'image/*': []
        },
        onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        }
    });
  
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
                    <p>Thả hoặc click vào để tải ảnh</p>
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