package com.ring.bookstore.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class ImageUpload {

    public boolean uploadImage(String uploadDir, String fileName, MultipartFile imageProduct) throws IOException{
        boolean isUpload = false;
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
         
        try (InputStream inputStream = imageProduct.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            isUpload = true;
        } catch (IOException ioe) {        
            throw new IOException("Could not save image file: " + fileName, ioe);
        } 
        return isUpload;
    }
//
//    public boolean checkExisted(MultipartFile imageProduct){
//        boolean isExisted = false;
//        try {
//            File file = new File(UPLOAD_FOLDER + "\\" + imageProduct.getOriginalFilename());
//            isExisted = file.exists();
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        return isExisted;
//    }
}
