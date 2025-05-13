package com.ring.model.enums;

import lombok.Getter;

import java.math.BigDecimal;

/**
 * Enum representing different types of shipping methods as {@link ShippingType}.
 * Each enum constant contains label, description, color, multiplier, and icon associated
 * with a specific shipping type.
 */
@Getter
public enum ShippingType {
    ECONOMY("Tiêu chuẩn", "2-4 ngày giao hàng", "", BigDecimal.ONE, "LocalShippingOutlined"),
    STANDARD("Tiết kiệm", "5-7 ngày giao hàng", "success", BigDecimal.valueOf(0.2), "SavingsOutlined"),
    EXPRESS("Hoả tốc", "1-2 ngày giao hàng", "warning", BigDecimal.valueOf(1.5), "RocketLaunchOutlined");

    private final String label;
    private final String description;
    private final String color;
    private final BigDecimal multiplier;
    private final String icon;

    private ShippingType(String label,
                         String description,
                         String color,
                         BigDecimal multiplier,
                         String icon) {
        this.label = label;
        this.description = description;
        this.color = color;
        this.multiplier = multiplier;
        this.icon = icon;
    }
}
