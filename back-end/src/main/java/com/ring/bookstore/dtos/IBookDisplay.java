package com.ring.bookstore.dtos;

//Display book info
public interface IBookDisplay {
	Integer getId();
	String getTitle();
	String getDescription();
	String getImage();
	Double getPrice();
	Integer getAmount();
	Integer getRateAmount();
	Integer getRateTotal();
	Integer getOrderTime();
}
