package com.ring.bookstore.dtos;

//Sách hiển thị
public interface IBookDisplay {
	Integer getId();
	String getTitle();
	String getDescription();
	String getImage();
	Double getPrice();
	Integer getRateAmount();
	Integer getRateTotal();
}
