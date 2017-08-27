package com.outstudio.plan.op.pdf;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.outstudio.plan.op.pdf.model.Furniture;
import com.outstudio.plan.op.pdf.model.HomePage;
import com.outstudio.plan.op.pdf.model.Room;

/**
 * 生成pdf各页的内容，即将svg解析后的对象装入pdf中
 * 
 * @author zhagz
 * 
 */
public class PDFPageCreater {

	private PdfCreater pc;
	private String absPath;
	private String pdfName;

	public void start(String absPath, String pdfName) throws IOException, DocumentException {
		this.absPath = absPath;
		File p = new File(absPath);
		if (!p.exists()) {
			p.mkdirs();
		}
		this.pdfName = pdfName;
		pc = new PdfCreater();
		pc.createPdf(absPath + "/" + pdfName);
	}

	public void finish() {
		pc.closePdf();
	}

	public void createMainPage(String biaoti, String description, String imagePath) throws DocumentException,
			IOException {
		Document doc = pc.getDocument();

		pc.addParagraph(biaoti, 30, BaseColor.GRAY);
		pc.addDescription(description, 15, BaseColor.BLACK);
		pc.addLineSeparator();

		pc.addMainPageImage(imagePath);
		pc.addLineSeparator();

		pc.addParagraph("平面图", 30, BaseColor.GRAY);

		pc.newPage();
	}

	/**
	 * 生成主页的方法
	 * 
	 * @param hp
	 * @throws IOException
	 * @throws DocumentException
	 */
	public void createMainPage(HomePage hp) throws IOException, DocumentException {
		Document doc = pc.getDocument();

		doc.addCreationDate();
		doc.addCreator("优速USU");
		doc.addHeader("软件制作", "SDU-OUTStudio");

		pc.addParagraph(hp.getBiaoti(), 30, BaseColor.GRAY);
		pc.addDescription(hp.getDescription(), 15, BaseColor.BLACK);
		pc.addLineSeparator();
		if (null != hp.getImage() && !"".equals(hp.getImage())) {
			pc.addMainPageImage(hp.getImage());
		}

		pc.addLineSeparator();
		/*
		 * pc.addParagraph("项目信息", 30, BaseColor.GRAY); pc.addLineSeparator(1,
		 * 30, BaseColor.BLACK, Element.ALIGN_LEFT, 0);
		 * 
		 * // 显示项目信息的ptable int fontSizeInPtable = 15;// 在ptable中的字体的大小
		 * PdfPTable ptable = new PdfPTable(new float[] { fontSizeInPtable * 8,
		 * pc.getDocument().getPageSize().getWidth() - fontSizeInPtable * 8 });
		 * ptable.setHorizontalAlignment(Element.ALIGN_LEFT);
		 * 
		 * PdfPCell cell = new PdfPCell(); if (hp.getName() != null) { //
		 * pc.addParagraph("项目名：" + hp.getName(), 12, BaseColor.BLACK);
		 * pc.getDocument().addTitle(hp.getName()); cell = pc.createCell("项目名：",
		 * fontSizeInPtable); ptable.addCell(cell); cell =
		 * pc.createCell(hp.getName(), fontSizeInPtable, BaseColor.BLACK);
		 * ptable.addCell(cell); } if (hp.getAuthor() != null &&
		 * !"".equals(hp.getAuthor())) { // pc.addParagraph("作者：" +
		 * hp.getAuthor(), 12, BaseColor.BLACK);
		 * pc.getDocument().addAuthor(hp.getAuthor()); cell =
		 * pc.createCell("作者：", fontSizeInPtable); ptable.addCell(cell); cell =
		 * pc.createCell(hp.getAuthor(), fontSizeInPtable, BaseColor.BLACK);
		 * ptable.addCell(cell); } if (hp.getContact() != null) { //
		 * pc.addParagraph("联系人：" + hp.getContact(), 12, BaseColor.BLACK); cell
		 * = pc.createCell("联系人：", fontSizeInPtable); ptable.addCell(cell); cell
		 * = pc.createCell(hp.getContact(), fontSizeInPtable, BaseColor.BLACK);
		 * ptable.addCell(cell); } if (hp.getEmail() != null) { //
		 * pc.addParagraph("邮箱：" + hp.getEmail(), 12, BaseColor.BLACK); cell =
		 * pc.createCell("邮箱：", fontSizeInPtable); ptable.addCell(cell); cell =
		 * pc.createCell(hp.getEmail(), fontSizeInPtable, BaseColor.BLACK);
		 * ptable.addCell(cell); } if (hp.getPhone() != null) { //
		 * pc.addParagraph("联系电话：" + hp.getPhone(), 12, BaseColor.BLACK); cell =
		 * pc.createCell("联系电话：", fontSizeInPtable); ptable.addCell(cell); cell
		 * = pc.createCell(hp.getPhone(), fontSizeInPtable, BaseColor.BLACK);
		 * ptable.addCell(cell); } if (hp.getAddress() != null) { //
		 * pc.addParagraph("地址：" + hp.getAddress(), 12, BaseColor.BLACK); cell =
		 * pc.createCell("地址：", fontSizeInPtable); ptable.addCell(cell); cell =
		 * pc.createCell(hp.getAddress(), fontSizeInPtable, BaseColor.BLACK);
		 * ptable.addCell(cell); } if (hp.getDate() != null) { //
		 * pc.addParagraph("创建日期：" + hp.getDate(), 12, BaseColor.BLACK); cell =
		 * pc.createCell("创建日期：", fontSizeInPtable); ptable.addCell(cell); cell
		 * = pc.createCell(hp.getDate(), fontSizeInPtable, BaseColor.BLACK);
		 * ptable.addCell(cell); } if (hp.getText() != null) { //
		 * pc.addParagraph("备注：" + hp.getText(), 12, BaseColor.BLACK); cell =
		 * pc.createCell("备注：", fontSizeInPtable); ptable.addCell(cell); cell =
		 * pc.createCell(hp.getText(), fontSizeInPtable, BaseColor.BLACK);
		 * cell.setNoWrap(false); ptable.addCell(cell); } pc.addElement(ptable);
		 */
		pc.newPage();
	}

	/**
	 * 生成文章正文的方法
	 * 
	 * @param room
	 * @throws DocumentException
	 * @throws IOException
	 */

	public void createNewPage(Room room) throws DocumentException, IOException {
		createNewPage(room, false, null);
	}

	/**
	 * 是否是最后一个room，是的话添加extData
	 * 
	 * @param room
	 * @param isLastRoom
	 * @param extData
	 * @throws DocumentException
	 * @throws IOException
	 */
	public void createNewPage(Room room, boolean isLastRoom, String extData) throws DocumentException, IOException {

		pc.addParagraph(room.getName(), 30, BaseColor.GRAY);
		pc.addDescription(room.getDescription(), 15, BaseColor.BLACK);
		pc.addLineSeparator();

		// img.scaleToFit(PageSize.A4);
		// img.scalePercent(50);
		// img.setAlignment(Image.RIGHT | Image.TEXTWRAP);
		// pc.addElement(img);

		/***** 只有描述数据的小table **********/
		Map<String, String> map = room.getData();
		PdfPCell cell = null;
		PdfPTable dataTable = new PdfPTable(2);

		if (map != null && !map.isEmpty()) {
			Set<String> set = map.keySet();
			Iterator<String> it = set.iterator();
			// System.out.println(map.size());
			while (it.hasNext()) {
				String key = it.next();
				cell = pc.createCell(key + ":", 10);
				dataTable.addCell(cell);
				cell = pc.createCell(map.get(key), 10);
				dataTable.addCell(cell);
				// System.out.println(key + ":" + map.get(key));
			}
		}
		/**** 有房间图片的大的table *******************/
		PdfPTable pt = new PdfPTable(5);

		// pt.setTotalWidth(PageSize.A4.getBorderWidth());

		cell = pc.createCell(dataTable);
		cell.setColspan(2);
		pt.addCell(cell);

		Image image = Image.getInstance(room.getImage());
		Image thumbnail = Image.getInstance(room.getThumbnail());

		// 房间大图
		if (image != null) {
			image.setAlignment(Image.RIGHT);
		}
		cell = pc.createCell(image);
		cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
		cell.setRowspan(4);
		cell.setColspan(3);
		pt.addCell(cell);

		// 房间缩略图
		if (thumbnail != null) {
			thumbnail.setAlignment(Element.ALIGN_CENTER);
		}
		cell = pc.createCell(null);// 改为null不将缩略图传入
		cell.setColspan(2);
		cell.setRowspan(4);
		// cell.setUseAscender(true);
		cell.setHorizontalAlignment(Element.ALIGN_LEFT);
		cell.setVerticalAlignment(Element.ALIGN_CENTER);
		pt.addCell(cell);

		pc.addElement(pt);
		pc.addLineSeparator();

		/******* 家具的table *********/
		/*
		 * 1行，5列 1格：ficon，图标 1格：name，名字 2格：fimg，实物图
		 */
		List<Furniture> list = room.getFurns();
		int index = 0;
		if (list != null) {
			index = list.size();
		}
		PdfPTable fp = null;
		Furniture f = null;

		// 家具的table
		fp = new PdfPTable(15);
		fp.setLockedWidth(true);// 设置true，然后自定义表格宽度
		float width = pc.getDocument().getPageSize().getWidth() * 0.9f;
		fp.setTotalWidth(width);
		fp.setHorizontalAlignment(Element.ALIGN_LEFT);

		// for循环遍历所有家具
		for (int i = 0; i < index; i++) {
			f = list.get(i);
			// icon
			Image ficon = null;
			if (f.getIcon() != null) {
				ficon = Image.getInstance(f.getIcon());
				ficon.scaleAbsolute(50, 50);
				ficon.setAlignment(Image.ALIGN_CENTER);
			}
			// img
			Image fimg = null;
			// System.out.println("f.getImage is " + f.getImage());
			if (f.getImage() != null) {
				fimg = Image.getInstance(f.getImage());
				fimg.setAlignment(Element.ALIGN_CENTER);
			}

			if (i == 0) {
				int titleFontSize = 13;
				cell = pc.createCell("序号", titleFontSize, BaseColor.BLACK, Element.ALIGN_CENTER);
				cell.setBorderWidth(1);
				cell.setBorder(Rectangle.BOTTOM);
				fp.addCell(cell);
				cell = pc.createCell("家具", titleFontSize, BaseColor.BLACK, Element.ALIGN_CENTER);
				cell.setColspan(2);
				cell.setBorderWidth(1);
				cell.setBorder(Rectangle.BOTTOM);
				fp.addCell(cell);
				cell = pc.createCell("规格", titleFontSize, BaseColor.BLACK, Element.ALIGN_CENTER);
				cell.setColspan(2);
				cell.setBorderWidth(1);
				cell.setBorder(Rectangle.BOTTOM);
				fp.addCell(cell);
				cell = pc.createCell("数量", titleFontSize, BaseColor.BLACK, Element.ALIGN_CENTER);
				cell.setColspan(2);
				cell.setBorderWidth(1);
				cell.setBorder(Rectangle.BOTTOM);
				fp.addCell(cell);
				cell = pc.createCell("单价", titleFontSize, BaseColor.BLACK, Element.ALIGN_CENTER);
				cell.setColspan(2);
				cell.setBorderWidth(1);
				cell.setBorder(Rectangle.BOTTOM);
				fp.addCell(cell);
				cell = pc.createCell("产品信息", titleFontSize, BaseColor.BLACK, Element.ALIGN_CENTER);
				cell.setColspan(3);
				cell.setBorderWidth(1);
				cell.setBorder(Rectangle.BOTTOM);
				fp.addCell(cell);
				cell = pc.createCell("实物图", titleFontSize, BaseColor.BLACK, Element.ALIGN_CENTER);
				cell.setBorderWidth(1);
				cell.setBorder(Rectangle.BOTTOM);
				cell.setColspan(3);
				fp.addCell(cell);
			}

			// 序号
			cell = pc.createCell("No." + (i + 1), 12, BaseColor.BLACK, Element.ALIGN_CENTER);
			cell.setColspan(1);
			cell.setBorderWidth(1);
			cell.setBorder(Rectangle.BOTTOM);
			fp.addCell(cell);

			// 图标
			cell = pc.createCell(ficon);
			cell.setColspan(2);
			cell.setPadding(5f);
			cell.setBorderWidth(1);
			cell.setBorder(Rectangle.BOTTOM);
			fp.addCell(cell);

			// 名字
			// System.out.println("itemName:" + f.getName() + ",item_unique:" +
			// f.getItem_unique());
			String name = "";
			if (null == f.getName() || "".equals(f.getName()) || "null".equals(f.getName())) {
				name = f.getItem_unique();
			} else {
				name = f.getName();
			}
			// 用名字括号部分代替括号外部分
			// System.out.println("name=" + name);
			if (name.contains("(")) {
				int name_start = 0;
				for (int a = 0; a < name.length(); a++) {
					if (name.charAt(a) <= '9' && name.charAt(a) >= '0') {
						name_start = a;
						break;
					}
				}
				// bracket：括号
				int bracket_start = name.indexOf("(");
				int bracket_end = name.indexOf(")");
				name = name.substring(0, name_start) + name.substring(bracket_start + 1, bracket_end);
			}
			// System.out.println("name=" + name);
			cell = pc.createCell(name, 10, BaseColor.BLACK, Element.ALIGN_CENTER);
			cell.setNoWrap(false);// 设定折行
			cell.setColspan(2);
			cell.setBorderWidth(1);
			cell.setBorder(Rectangle.BOTTOM);
			cell.setPadding(5f);
			fp.addCell(cell);

			// 数量
			cell = pc.createCell(f.getNumber() == 0 ? "1个" : f.getNumber() + "", 10, BaseColor.BLACK,
					Element.ALIGN_CENTER);
			cell.setColspan(2);
			cell.setBorderWidth(1);
			cell.setBorder(Rectangle.BOTTOM);
			cell.setPadding(5f);
			cell.setNoWrap(false);// 设定折行
			fp.addCell(cell);

			// 价格
			cell = pc.createCell((f.getPrice() == 0) ? "￥0.00" : "￥" + f.getPrice(), 10, BaseColor.BLACK,
					Element.ALIGN_CENTER);
			cell.setColspan(2);
			cell.setBorderWidth(1);
			cell.setBorder(Rectangle.BOTTOM);
			cell.setPadding(5f);
			cell.setNoWrap(false);// 设定折行
			fp.addCell(cell);

			// text
			cell = pc.createCell(("".equals(f.getText()) || null == f.getText()) ? "" : f.getText(), 10,
					BaseColor.BLACK, Element.ALIGN_CENTER);
			cell.setColspan(3);
			cell.setBorderWidth(1);
			cell.setBorder(Rectangle.BOTTOM);
			cell.setPadding(5f);
			cell.setNoWrap(false);// 设定折行
			fp.addCell(cell);

			// 实物图
			cell = pc.createCell(fimg);
			cell.setColspan(3);
			cell.setBorderWidth(1);
			cell.setBorder(Rectangle.BOTTOM);
			cell.setPadding(5f);
			fp.addCell(cell);

		} // endfor
		pc.addElement(fp);
		pc.addParagraph("合计：" + room.getFurnsTotalPrice(), 20, BaseColor.DARK_GRAY, Paragraph.ALIGN_RIGHT);
		if (isLastRoom) {
			pc.addLineSeparator(1, 40, BaseColor.BLACK, Element.ALIGN_RIGHT, 0);
			pc.addParagraph("项目总计：" + extData, 22, BaseColor.BLACK, Paragraph.ALIGN_RIGHT);
		}

		pc.newPage();
	}

	/**
	 * 只生成只包含room大图的页面
	 * 
	 * @param room
	 * @throws DocumentException
	 * @throws IOException
	 */
	public void createRoomPageOnly(Room room) throws DocumentException, IOException {
		pc.addParagraph(room.getName(), 30, BaseColor.GRAY);
		pc.addDescription(room.getDescription(), 15, BaseColor.BLACK);
		pc.addLineSeparator();

		Image image = Image.getInstance(room.getImage());

		// 房间大图
		if (image != null) {
			image.setAlignment(Image.ALIGN_CENTER);
		}
		Document doc = pc.getDocument();
		// image.scaleAbsoluteWidth(doc.getPageSize().getWidth() * 0.9f);
		image.scaleToFit(doc.getPageSize().getWidth() * 0.8f, doc.getPageSize().getHeight() * 0.7f);
		doc.add(image);
		pc.newPage();

	}

}
