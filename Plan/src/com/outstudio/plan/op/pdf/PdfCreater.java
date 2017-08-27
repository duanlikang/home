package com.outstudio.plan.op.pdf;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;

import com.itextpdf.awt.AsianFontMapper;
import com.itextpdf.awt.FontMapper;
import com.itextpdf.awt.PdfGraphics2D;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;

/**
 * 封装类
 * 
 * @author zhagz
 * 
 */
public class PdfCreater {

	private Document document;
	private PdfWriter pw;

	private static Rectangle pageSize = PageSize.A4;
	private static int CellBorderWidth = 0;

	/**
	 * 提供Document以便添加额外没封装好的需要。
	 */
	protected Document createPdf(String fpath) throws FileNotFoundException, DocumentException {
		return createPdf(fpath, PageSize.A4);
	}

	public Document createPdf(String fpath, Rectangle pagesize) throws FileNotFoundException, DocumentException {
		pageSize = pagesize;
		document = new Document(pageSize);
		pw = PdfWriter.getInstance(document, new FileOutputStream(fpath));
		document.open();
		return document;
	}

	public void closePdf() {
		if (document != null) {
			if (document.isOpen()) {
				document.close();
			}
		}
		if (pw != null) {
			if (!pw.isCloseStream()) {
				pw.close();
			}
		}
	}

	public void addParagraph(String context) throws DocumentException, IOException {
		addParagraph(context, 15, BaseColor.BLACK);
	}

	public void addParagraph(String context, int fontSize) throws DocumentException, IOException {
		addParagraph(context, fontSize, BaseColor.BLACK);
	}

	public void addParagraph(String context, int fontSize, BaseColor baseColor) throws DocumentException, IOException {
		addParagraph(context, fontSize, baseColor, Paragraph.ALIGN_UNDEFINED);
	}

	/**
	 * 
	 * @param context
	 * @param fontSize
	 * @param baseColor
	 * @param aligenment
	 *            对齐方式
	 * @throws DocumentException
	 * @throws IOException
	 */
	public void addParagraph(String context, int fontSize, BaseColor baseColor, int aligenment)
			throws DocumentException, IOException {
		// 添加 中文信息
		BaseFont bfCN = BaseFont.createFont("STSongStd-Light", "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.NORMAL, baseColor);
		Paragraph p = new Paragraph(context, fontCN);
		p.setAlignment(aligenment);
		document.add(p);
	}

	public Paragraph createParagraph(String context, int fontSize, BaseColor baseColor) throws DocumentException,
			IOException {
		BaseFont bfCN = BaseFont.createFont("STSongStd-Light", "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.NORMAL, baseColor);
		Paragraph p = new Paragraph(context, fontCN);
		return p;
	}

	public void addDescription(String context, int fontSize, BaseColor baseColor) throws DocumentException, IOException {
		BaseFont bfCN = BaseFont.createFont("STSongStd-Light", "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.NORMAL, baseColor);
		Paragraph p = new Paragraph(context, fontCN);
		p.setIndentationLeft(40);
		document.add(p);
	}

	public Phrase createPhrase(String context, int fontSize) throws DocumentException, IOException {
		return createPhrase(context, fontSize, BaseColor.BLACK);
	}

	public Phrase createPhrase(String context, int fontSize, BaseColor baseColor) throws DocumentException, IOException {
		BaseFont bfCN = BaseFont.createFont("STSongStd-Light", "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.NORMAL, baseColor);
		Phrase p = new Phrase(context, fontCN);
		return p;
	}

	public void addChunk(String context, int fontSize) throws DocumentException, IOException {
		// 添加 中文信息
		BaseFont bfCN = BaseFont.createFont("STSongStd-Light", "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.NORMAL, BaseColor.BLACK);
		Chunk chunk = new Chunk(context, fontCN);
		document.add(chunk);
	}

	public void addImage(String imagePath) throws MalformedURLException, IOException, DocumentException {
		Image image = Image.getInstance(imagePath);
		image.scaleToFit(document.getPageSize());
		document.add(image);
	}

	public void addMainPageImage(String imagePath) throws MalformedURLException, IOException, DocumentException,
			NullPointerException {
		Image image = Image.getInstance(imagePath);
		// image.scaleToFit(document.getPageSize());
		image.scaleToFit(document.getPageSize().getWidth() / 3 * 2, document.getPageSize().getHeight() / 2);
		// image.scalePercent(image.getHeight(d
		// image.scaleAbsolute(document.getPageSize().getWidth(),
		// document.getPageSize().getHeight() / 2);
		document.add(image);
	}

	public PdfTemplate createTemplate() {
		PdfContentByte pcb = new PdfContentByte(pw);
		PdfTemplate template = pcb.createTemplate(pageSize.getWidth(), pageSize.getHeight());
		return template;
	}

	public void addLineSeparator() throws DocumentException {
		Paragraph p = new Paragraph();
		p.add(new Chunk(new LineSeparator()));
		document.add(p);
	}

	public void addLineSeparator(float lineWidth, float percentage, BaseColor lineColor, int align, float offset)
			throws DocumentException {
		Paragraph p = new Paragraph();
		p.add(new Chunk(new LineSeparator(lineWidth, percentage, lineColor, align, offset)));
		document.add(p);
	}

	public void newPage() {
		document.newPage();
	}

	public void addG() {
		PdfContentByte pdfCB = pw.getDirectContent();
		FontMapper fm = new AsianFontMapper(AsianFontMapper.ChineseSimplifiedFont,
				AsianFontMapper.ChineseSimplifiedEncoding_H);
		PdfGraphics2D pdfG = new PdfGraphics2D(pdfCB, PageSize.A4.getWidth(), PageSize.A4.getHeight(), fm);
		// pdfG.drawLine(x1, y1, x2, y2);
	}

	public PdfPCell createCell(String context, int fontSize) throws DocumentException, IOException {
		PdfPCell cell = new PdfPCell();
		cell.setBorderWidth(CellBorderWidth);
		// cell.disableBorderSide(Rectangle.BOX);
		// cell.setBorder(Rectangle.BOX);
		// cell.setHorizontalAlignment(Element.ALIGN_CENTER);
		// cell.setVerticalAlignment(Element.ALIGN_CENTER);
		// cell.setNoWrap(false);
		cell.addElement(this.createPhrase(context, fontSize));
		return cell;
	}

	public PdfPCell createCell(String context, int fontSize, BaseColor baseColor) throws DocumentException, IOException {
		PdfPCell cell = new PdfPCell();
		cell.setBorderWidth(CellBorderWidth);
		cell.addElement(this.createParagraph(context, fontSize, baseColor));
		return cell;
	}

	public PdfPCell createCell(String context, int fontSize, BaseColor baseColor, int alignment)
			throws DocumentException, IOException {
		PdfPCell cell = new PdfPCell();
		cell.setBorderWidth(CellBorderWidth);
		BaseFont bfCN = BaseFont.createFont("STSongStd-Light", "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.NORMAL, baseColor);
		Paragraph p = new Paragraph(context, fontCN);
		p.setAlignment(alignment);
		// cell.setPhrase(p);// 区别？
		cell.addElement(p);
		return cell;
	}

	public PdfPCell createCellWithSymbol(String symbol, int fontSize) throws DocumentException, IOException {
		PdfPCell cell = new PdfPCell();
		cell.setBorderWidth(CellBorderWidth);
		// cell.disableBorderSide(Rectangle.BOX);
		// cell.setBorder(Rectangle.BOX);
		BaseFont bfCN = BaseFont.createFont(FontFactory.HELVETICA_BOLD, "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.NORMAL, BaseColor.BLACK);
		Phrase p = new Phrase(symbol, fontCN);

		cell.addElement(p);
		return cell;
	}

	public PdfPCell createCell(Element ele) {
		PdfPCell cell = new PdfPCell();
		// cell.disableBorderSide(Rectangle.BOX);
		cell.setBorderWidth(CellBorderWidth);
		cell.addElement(ele);
		return cell;
	}

	public void addElement(Element ele) throws DocumentException {
		document.add(ele);
	}

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

}
