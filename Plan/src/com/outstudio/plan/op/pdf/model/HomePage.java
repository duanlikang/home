package com.outstudio.plan.op.pdf.model;

public class HomePage {

	private String biaoti = null;
	private String description = null;
	private String image = null;

	private String name = null;// 项目名
	private String author = null;// 作者
	private String phone = null;// 联系电话
	private String contact = null;// 联系人
	private String email = null;// 邮箱
	private String address = null;// 联系地址
	private String date = null; // 日期
	private String text = null; // 备注信息
	private float totalPrice;// 所有房间的总价格

	public String getBiaoti() {
		return biaoti;
	}

	public void setBiaoti(String biaoti) {
		this.biaoti = biaoti;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Override
	public String toString() {
		return "HomePage [biaoti=" + biaoti + ", description=" + description + ", image=" + image + ", name=" + name
				+ ", author=" + author + ", phone=" + phone + ", contact=" + contact + ", email=" + email
				+ ", address=" + address + ", date=" + date + ", text=" + text + ", totalPrice=" + totalPrice + "]";
	}

}
