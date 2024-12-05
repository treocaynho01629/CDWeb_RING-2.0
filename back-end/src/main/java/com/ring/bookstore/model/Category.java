package com.ring.bookstore.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

import lombok.*;
import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
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
    private String name;

    @Column(length = 500)
    @Nationalized
    @JsonIgnore
    private String description;

    @Column(unique = true)
    private String slug;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            mappedBy = "cate",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Book> cateBooks;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "parent",
            fetch = FetchType.LAZY)
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

    @PreRemove
    private void updateOrRemoveBooks() {
        for (Book b : this.cateBooks) {
            if (this.parent != null) {
                b.setCate(this.parent);
            } else {
                b.setCate(null);
            }
        }
    }
}
