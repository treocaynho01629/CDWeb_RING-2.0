package com.ring.bookstore.model;

public class Item {
	
	private int id;
	private Book book;
	private int quantity;
	private double price;
	
	public Item(int id, Book book, int quantity, double price) {
		
		this.id = id;
		this.book = book;
		this.quantity = quantity;
		this.price = price;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}
	
	public double getTotalPrice() {
		
		return this.price * this.quantity;
	}

	public String toString() {
		return "Item [id=" + id + ", book=" + book + ", quantity=" + quantity + ", price=" + price + "]";
	}
}
