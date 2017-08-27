package com.outstudio.plan.op.pdf;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfGState;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;

public class WaterMarker {

	private String SRC = null;
	private String DEST = null;

	public static void main(String[] args) throws IOException, DocumentException {
		String SRC = "E://pdf.pdf";
		String DEST = "E:/side_watermark.pdf";

		File file = new File(DEST);
		file.getParentFile().mkdirs();
		new WaterMarker().manipulatePdf(SRC, DEST, "优速USU", 50);
	}

	public WaterMarker(String pdfPath, String outputLocation) {
		this.SRC = pdfPath;
		this.DEST = outputLocation;
	}

	private WaterMarker() {

	}

	/**
	 * 
	 * @param content
	 * @param fontSize
	 * @throws IOException
	 * @throws DocumentException
	 */
	public void addTextWaterMarker(String content, int fontSize) throws IOException, DocumentException {
		File file = new File(DEST);
		file.getParentFile().mkdirs();
		new WaterMarker().manipulatePdf(SRC, DEST, content, fontSize);
	}

	private void manipulatePdf(String src, String dest, String content, int fontSize) throws IOException,
			DocumentException {
		PdfReader reader = new PdfReader(src);
		int n = reader.getNumberOfPages();
		PdfStamper stamper = new PdfStamper(reader, new FileOutputStream(dest));
		// text watermark
		BaseFont bfCN = BaseFont.createFont("STSongStd-Light", "UniGB-UCS2-H", true);
		Font fontCN = new Font(bfCN, fontSize, Font.ITALIC, BaseColor.GRAY);
		Phrase p = new Phrase(content, fontCN);
		// transparency
		PdfGState gs1 = new PdfGState();
		gs1.setFillOpacity(0.5f);
		// properties
		PdfContentByte over;
		Rectangle pagesize;
		float x, y;
		// loop over every page
		for (int i = 1; i <= n; i++) {
			pagesize = reader.getPageSizeWithRotation(i);
			x = (pagesize.getLeft() + pagesize.getRight()) / 2;
			y = (pagesize.getTop() + pagesize.getBottom()) / 3;
			over = stamper.getOverContent(i);
			over.saveState();
			over.setGState(gs1);
			ColumnText.showTextAligned(over, Element.ALIGN_CENTER, p, x, y, 45);
			over.restoreState();
		}
		stamper.close();
		reader.close();
	}
}