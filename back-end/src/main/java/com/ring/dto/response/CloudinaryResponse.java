package com.ring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a Cloudinary response as {@link CloudinaryResponse} containing url and image's publicId.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CloudinaryResponse {

    private String publicId;
    private String url;
}
