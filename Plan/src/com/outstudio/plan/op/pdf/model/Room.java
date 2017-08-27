package com.outstudio.plan.op.pdf.model;

import java.util.List;
import java.util.Map;

public class Room {

	private String id; // id?
	private String name;
	private String description;
	private String thumbnail;// 缩略图
	private String image;

	private Map<String, String> data;

	private float furnsTotalPrice;// 房间里家具的总价格

	// private double width;
	// private double heigth;
	// private double area;// 面积
	// private double surroundings;// 周边长度

	private List<Furniture> furns;

	public String getDescription() {
		return description;
	}

	public List<Furniture> getFurns() {
		return furns;
	}

	public String getName() {
		return name;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setFurns(List<Furniture> furns) {
		this.furns = furns;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public Map<String, String> getData() {
		return data;
	}

	public void setData(Map<String, String> data) {
		this.data = data;
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

	public float getFurnsTotalPrice() {
		return furnsTotalPrice;
	}

	public void setFurnsTotalPrice(float furnsTotalPrice) {
		this.furnsTotalPrice = furnsTotalPrice;
	}

	@Override
	public String toString() {
		return "Room [id=" + id + ", name=" + name + ", description=" + description + ", thumbnail=" + thumbnail
				+ ", image=" + image + ", data=" + data + ", furnsTotalPrice=" + furnsTotalPrice + ", furns=" + furns
				+ "]";
	}

}
