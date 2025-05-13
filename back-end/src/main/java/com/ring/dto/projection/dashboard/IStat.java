package com.ring.dto.projection.dashboard;

/**
 * Represents a statistical projection as {@link IStat}, containing data for total, current month,
 * and last month values.
 */
public interface IStat {

    Double getTotal();

    Double getCurrentMonth();

    Double getLastMonth();
}
