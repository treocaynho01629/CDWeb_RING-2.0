package com.ring.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Auditable entity class named {@link Auditable} with common fields for audit tracking and lifecycle management.
 * Provides automatic population of audit fields using JPA lifecycle annotations.
 */
@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    protected LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "updated_at")
    protected LocalDateTime lastModifiedDate;

    @JsonIgnore
    @Column(name = "active", columnDefinition = "boolean default true")
    private boolean active = true;
}
