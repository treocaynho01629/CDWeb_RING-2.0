package com.ring.bookstore.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Entity
@Table(name = "image")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Image {
    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Lob
    @Column(name = "image")
    @JdbcTypeCode(SqlTypes.BINARY)
    @JsonIgnore
    private byte[] image;

    //Image relation
    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            fetch = FetchType.LAZY,
            mappedBy = "image")
    @JsonIgnore
    private Book book;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            fetch = FetchType.LAZY,
            mappedBy = "image")
    @JsonIgnore
    private AccountProfile profile;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            fetch = FetchType.LAZY,
            mappedBy = "image")
    @JsonIgnore
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id")
    @JsonIgnore
    private BookDetail detail;

    //Sub resized images
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Image parent;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "parent",
            fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.EXTRA)
    @JsonIgnore
    private List<Image> subImages;

    public String getFileDownloadUri() {
        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(this.name)
                .toUriString();
    }

    public void addSubImage(Image subImage) {
        subImages.add(subImage);
        subImage.setParent(this);
    }

    public void removeSubImage(Image subImage) {
        subImages.remove(subImage);
        subImage.setParent(null);
    }
}
