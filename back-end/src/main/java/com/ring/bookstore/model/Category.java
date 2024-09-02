package com.ring.bookstore.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    private Integer id;

    @Column(length = 200)
    @Nationalized 
    private String categoryName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cate", fetch = FetchType.LAZY)
    private Set<Sub> cateSubs;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cate")
    @JsonIgnore
    private Set<Book> cateBooks;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Category parent;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "parent",
            fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.EXTRA)
    @JsonIgnore
    private List<Category> subCates;

    public void addSubCate(Category subCate) {
        subCates.add(subCate);
        subCate.setParent(this);
    }

    public void removeSubCate(Category subCate) {
        subCates.remove(subCate);
        subCate.setParent(null);
    }
}
