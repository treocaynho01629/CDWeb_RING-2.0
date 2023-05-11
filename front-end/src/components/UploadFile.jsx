import React, { useState } from 'react';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

const UploadFile = () => {
    const [files, setFiles] = useState('');
    //state for checking file size
    const [fileSize, setFileSize] = useState(true);
    // for file upload progress message
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    //for displaying response message
    const [fileUploadResponse, setFileUploadResponse] = useState(null);
    //base end point url
    const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8080";

    const axiosPrivate = useAxiosPrivate();

    const uploadFileHandler = (event) => {
        setFiles(event.target.files);
       };

      const fileSubmitHandler = async (event) => {
       event.preventDefault();
       setFileSize(true);
       setFileUploadProgress(true);
       setFileUploadResponse(null);

        const formData = new FormData();

        const json = JSON.stringify({
            image: "https://cdn0.fahasa.com/media/catalog/product/h/o/hoi-chung-tuoi-thanh-xuan_9_ban-gioi-han.jpg",
            price: "99999",
            amount: "99",
            title: "Test",
            description: "Test",
            type: "Test",
            author: "Test",
            pubId: "1",
            cateId: "1",
            weight: "99.9",
            size: "Test",
            pages: "99",
            date: "2011-11-11",
            language: "Test"
        });
        const blob = new Blob([json], {
            type: 'application/json'
        });
        
        formData.append(`request`, blob);

        for (let i = 0; i < files.length; i++) {
            // if (files[i].size > 2048){
            //     setFileSize(false);
            //     setFileUploadProgress(false);
            //     setFileUploadResponse(null);
            //     return;
            // }

            formData.append(`image`, files[i])
        }

        const requestOptions = {
            method: 'POST',
            body: formData
        };

        // fetch(FILE_UPLOAD_BASE_ENDPOINT+'/api/books', requestOptions)
        //     .then(async response => {
        //         const isJson = response.headers.get('content-type')?.includes('application/json');
        //         const data = isJson && await response.json();

        //         // check for error response
        //         if (!response.ok) {
        //             // get error message
        //             const error = (data && data.message) || response.status;
        //             setFileUploadResponse(data.message);
        //             return Promise.reject(error);
        //         }

        //        console.log(data.message);
        //        setFileUploadResponse(data.message);
        //     })
        //     .catch(error => {
        //         console.error('Error while uploading file!', error);
        //     });

            

            try {
                const response = await axiosPrivate.post(FILE_UPLOAD_BASE_ENDPOINT+'/api/books',
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        withCredentials: true
                    }
                );
                console.log(JSON.stringify(response))
            } catch (err) {
                console.log(err);
                if (!err?.response) {
                } else if (err.response?.status === 409) {
                } else if (err.response?.status === 400) {
                } else {
                }
                errRef.current.focus();
            }

        setFileUploadProgress(false);
      };

    return(

      <form onSubmit={fileSubmitHandler}>
         <input type="file"  multiple onChange={uploadFileHandler}/>
         <button type='submit'>Upload</button>
         {!fileSize && <p style={{color:'red'}}>File size exceeded!!</p>}
         {fileUploadProgress && <p style={{color:'red'}}>Uploading File(s)</p>}
        {fileUploadResponse!=null && <p style={{color:'green'}}>{fileUploadResponse}</p>}
      </form>

    );
}
export default UploadFile;