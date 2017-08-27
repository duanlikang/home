package com.outstudio.plan.op.pdf;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.outstudio.plan.op.pdf.model.Furniture;
import com.outstudio.plan.op.pdf.model.Room;

public class test {

	public static void main(String[] args) throws DocumentException, IOException {
		Room room = new Room();
		Furniture furn = new Furniture();

		room.setName("卧室");
		room.setImage("E://svg/png20160124.png");
		room.setDescription("this is a 卧室 in the corner.");
		room.setThumbnail("E://svg/png20160124.png");

		Map<String, String> map = new HashMap<>();
		map.put("长", "10m");
		map.put("宽", "10.2m");
		map.put("高", "10m");
		map.put("面积", "100m2");
		room.setData(map);

		furn.setDescription("this is a furniture.");
		furn.setImage("E://svg/data/sofaImg.png");
		furn.setName("椅子");
		List<Furniture> list = new ArrayList<>();
		list.add(furn);
		list.add(furn);

		room.setFurns(list);

		PDFPageCreater ppc = new PDFPageCreater();
		ppc.start("E://svg", "pdfTest.pdf");
		ppc.createMainPage("主页", null, "E://svg/png20160124.png");
		ppc.createNewPage(room);
		ppc.finish();
	}

	public void test() throws Exception {
		PdfCreater pc = new PdfCreater();
		Document doc = pc.createPdf("E://svg/pdfTest.pdf");
		pc.addParagraph("总览", 30, BaseColor.DARK_GRAY);
		pc.addDescription(null, 15, BaseColor.BLACK);
		pc.addLineSeparator();
		pc.addImage("E://svg/png20160124.png");

		pc.addLineSeparator();

		pc.addParagraph("平面图", 30, BaseColor.DARK_GRAY);

		pc.newPage();
		/********** 首页完成 *************/
		pc.addParagraph("房间 1\n", 30, BaseColor.BLACK);
		pc.addLineSeparator();

		// pc.addParagraph("长度：10米", 10);
		// pc.addParagraph("宽度：150米", 10);
		// pc.addParagraph("周边：16.72米", 10);
		//
		Image img = Image.getInstance("E://svg/rooms/No1svg.png");
		// img.scaleToFit(PageSize.A4);
		// img.scalePercent(50);
		// img.setAlignment(Image.RIGHT | Image.TEXTWRAP);
		// pc.addElement(img);

		PdfPTable ptable = new PdfPTable(2);
		PdfPCell cell = pc.createCell("长度：", 12);

		ptable.addCell(cell);
		cell = pc.createCell("15m", 12);
		ptable.addCell(cell);
		cell = pc.createCell("宽度：", 12);
		ptable.addCell(cell);
		cell = pc.createCell("10m", 12);
		ptable.addCell(cell);
		cell = pc.createCell("高度：", 12);
		ptable.addCell(cell);
		cell = pc.createCell("2m", 12);
		ptable.addCell(cell);

		PdfPTable pt = new PdfPTable(4);
		cell = pc.createCell(ptable);
		pt.addCell(cell);

		cell = pc.createCell(img);
		cell.setHorizontalAlignment(Element.ALIGN_CENTER);
		cell.setRowspan(4);
		cell.setColspan(3);
		pt.addCell(cell);
		cell = pc.createCell(Image.getInstance("E://svg/png20160124.png"));
		cell.setRowspan(3);
		cell.setUseAscender(true);
		cell.setHorizontalAlignment(Element.ALIGN_CENTER);
		cell.setVerticalAlignment(Element.ALIGN_CENTER);
		pt.addCell(cell);

		pc.addElement(pt);

		pc.addLineSeparator();
		PdfPTable fp = new PdfPTable(5);
		img.scaleAbsolute(50, 50);
		cell = pc.createCell(img);
		fp.addCell(cell);
		cell = pc.createCell("家具", 15);
		// cell.setBorderWidth(0);
		// cell.setBorder(Rectangle.BOX);
		cell.setColspan(2);
		fp.addCell(cell);
		img.scaleAbsolute(100, 100);
		cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
		cell = pc.createCell(img);
		cell.setColspan(2);
		fp.addCell(cell);

		pc.addElement(fp);

		pc.addLineSeparator();
		pc.closePdf();

	}
}
