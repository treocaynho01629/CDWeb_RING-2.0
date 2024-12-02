package com.ring.bookstore.model;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "image")
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

    @Column(unique = true, name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image")
    @JdbcTypeCode(SqlTypes.BINARY)
    @JsonIgnore
    private byte[] image;

    //Image relation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id")
    @JsonIgnore
    private BookDetail detail;

    //Sub resized images
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Image parent;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "parent",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Image> subImages;

    public Image(byte[] image, String type) {
        this.image = image;
        this.type = type;
    }

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
