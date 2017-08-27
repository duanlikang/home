package com.outstudio.plan.op.pdf.model;

public class Furniture {

	private String id;
	private String name; // 名字
	private String icon; // 图标
	private String item_unique; // item_unique名字
	private String description; // 描述/备注
	private String image; // 实物图链接
	private String imgWidth;// 实物图宽
	private String imgHeight;// 实物图宽
	private String text; // 描述？
	private int number = 1; // 个数,在room中循环计算的时候用，初始化为1（即默认本身存在一个）
	private float price; // 价格

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getItem_unique() {
		return item_unique;
	}

	public void setItem_unique(String item_unique) {
		this.item_unique = item_unique;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getImgWidth() {
		return imgWidth;
	}

	public void setImgWidth(String imgWidth) {
		this.imgWidth = imgWidth;
	}

	public String getImgHeight() {
		return imgHeight;
	}

	public void setImgHeight(String imgHeight) {
		this.imgHeight = imgHeight;
	}

	public int getNumber() {
		return number;
	}

	public void addNumber() {
		number++;
	}

	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "Furniture [id=" + id + ", name=" + name + ", icon=" + icon + ", item_unique=" + item_unique
				+ ", description=" + description + ", image=" + image + ", imgWidth=" + imgWidth + ", imgHeight="
				+ imgHeight + ", text=" + text + ", number=" + number + ", price=" + price + "]";
	}

}
