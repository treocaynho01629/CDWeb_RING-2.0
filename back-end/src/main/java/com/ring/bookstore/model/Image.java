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
	private Integer id;

	@Column(name = "name")
	private String name;

	@Column(name = "type")
	private String type;

	@Lob
	@Column(name = "image")
	@JdbcTypeCode(SqlTypes.BINARY)
	private byte[] image;

	//Image relation
	@OneToOne(cascade = CascadeType.ALL,
			orphanRemoval = true,
			mappedBy = "image")
	@JsonIgnore
	private Book book;

	@OneToOne(cascade = CascadeType.ALL,
			orphanRemoval = true,
			mappedBy = "image")
	@JsonIgnore
	private Account user;

	@OneToOne(cascade = CascadeType.ALL,
			orphanRemoval = true,
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

	public void addSubImage(Image subImage) {
		subImages.add(subImage);
		subImage.setParent(this);
	}

	public void removeSubImage(Image subImage) {
		subImages.remove(subImage);
		subImage.setParent(null);
	}
}
