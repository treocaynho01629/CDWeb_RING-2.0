package com.ring.bookstore.model;

import java.util.ArrayList;
import java.util.List;

public class Cart {
	
	private int id;
	private Account customer;
	private List<Item> items;
	private int status = 0;
	
	public Cart() {
		
		items = new ArrayList<Item>();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Account getCustomer() {
		return customer;
	}

	public void setCustomer(Account customer) {
		this.customer = customer;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		
		this.items = items;
	}
	
	public void changeItemQuantity(int itemId, int quantity) {
		
		for (Item i : items) {
			
			if (i.getId() == itemId){
				
				i.setQuantity(quantity);
			}
		}
		
		updateStatus();
	}
	
	public void increaseItem(int itemId) {
		
		for (Item i : items) {
			
			if (i.getId() == itemId){
				
				i.setQuantity(i.getQuantity() + 1);
			}
		}
		
		updateStatus();
	}
	
	public void decreaseItem(int itemId) {
		
		int pos = -1;
		
		for (Item i : items) {
			
			if (i.getId() == itemId){
				
				i.setQuantity(i.getQuantity() - 1);
			}
			
			if (i.getQuantity() <= 0) {
				
				pos = items.indexOf(i);
			}
		}
		
		if (pos != -1) {
			
			items.remove(pos);
		}
		
		updateStatus();
	}
	
	public void removeItem(int itemId) {
		
		int pos = -1;
		
		for (Item i : items) {
			
			if (i.getId() == itemId){
				
				pos = items.indexOf(i);
			}
		}
		
		if (pos != -1) {
			
			items.remove(pos);
		}
		
		updateStatus();
	}
	
	public void clearItems() {
		
		items.clear();
		updateStatus();
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	
	public void updateStatus() {
		
//		int total = 0;
//		
//		for (Item i : items) {
//		
//			total += i.getQuantity();
//		}
//		
//		this.status = total;
		
		this.status = this.items.size();
	}
	
	public double getCartTotalPrice () {
		
		double result = 0;
		
		for (Item i : items) {
			
			result += (i.getTotalPrice());
		}
		
		return result;
	}

	public String toString() {
		
		return "Cart [id=" + id + ", customer=" + customer + ", items=" + items + ", status=" + status + "]";
	}
}
