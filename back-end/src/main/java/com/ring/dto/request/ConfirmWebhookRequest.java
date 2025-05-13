package com.ring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a confirm webhook request as {@link ConfirmWebhookRequest}.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmWebhookRequest {
	
	@NotBlank(message = "URL Webhook không được bỏ trống!")
	private String webhookUrl;

}
