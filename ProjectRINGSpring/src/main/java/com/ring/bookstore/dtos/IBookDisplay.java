package com.ring.bookstore.dtos;

public interface IBookDisplay {
	Integer getId();
	String getTitle();
	String getDescription();
	String getImage();
	Double getPrice();
	Integer getRateAmount();
	Integer getRateTotal();
}
