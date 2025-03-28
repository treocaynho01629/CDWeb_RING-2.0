package com.ring.bookstore.ultils;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.enums.ImageSize;
import com.ring.bookstore.exception.HttpResponseException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RequiredArgsConstructor
@Component
public class FileUploadUtil {

    private final Cloudinary cloudinary;

    public static final String PRODUCT_FOLDER = "/ring/products";
    public static final String SHOP_FOLDER = "/ring/shops";
    public static final String BANNER_FOLDER = "/ring/banners";
    public static final String USER_FOLDER = "/ring/users";
    public static final String ASSET_FOLDER = "/ring/assets";
    public static final String IMAGE_PATTERN = "([^\\s]+(\\.(?i)(jpg|png|gif|bmp))$)";
    public static final Integer PRODUCT_SIZE = 600;
    public static final Integer ASSET_SIZE = 250;
    public static final Integer BANNER_SIZE = 1297;

    public static boolean isAllowedExtension(final String fileName, final String pattern) {
        final Matcher matcher = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(fileName);
        return matcher.matches();
    }

    public static void assertAllowed(MultipartFile file, String pattern) {
        final String fileName = file.getOriginalFilename();
        if (!isAllowedExtension(fileName, pattern)) {
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid image types!");
        }
    }

    public static String getFileName(final MultipartFile file) {
        return System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
    }

    public Map<String, String> generateUrl(String publicId) {
        //Generate url
        Map<String, String> srcSet = new HashMap<>();
        for (ImageSize size : ImageSize.values()) {
            srcSet.put(size.name(), cloudinary.url().transformation(new Transformation()
                            .width(size.getWidth())
                            .quality("auto")
                            .fetchFormat("auto"))
                    .secure(true).generate(publicId));
        }

        return srcSet;
    }
}
