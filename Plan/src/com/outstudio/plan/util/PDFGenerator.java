package com.outstudio.plan.util;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.w3c.dom.Document;

import com.itextpdf.text.DocumentException;
import com.mongodb.DBObject;
import com.outstudio.plan.op.pdf.PDFPageCreater;
import com.outstudio.plan.op.pdf.model.HomePage;
import com.outstudio.plan.op.pdf.model.Room;
import com.outstudio.plan.op.svg.JsonOp;
import com.outstudio.plan.op.svg.PrimaryJsonPaser;
import com.outstudio.plan.op.svg.SvgOp;

public class PDFGenerator {
	private static final String tempDir = "D:/svgTemp";

	public static boolean generate(DBObject project) {
		try {
			String description = (String) project.get("description");
			String projectId = (String) project.get("_id");
			PrimaryJsonPaser.setExtDirName("/extJson/");
			FileUtils.write(new File("D:/1.txt"), description);
			Document doc = JsonOp.transtxt(description, "D:/svg", "/extJson/", null, null);
			PDFPageCreater ppc = new PDFPageCreater();
			ppc.start("D:/", projectId + ".pdf");
			SvgOp so = new SvgOp(tempDir);
			HomePage hp = so.getHomePage(doc);
			List<Room> rooms = so.getRoom(doc);
			try {
				ppc.createMainPage(hp);
				for (Room room : rooms) {
					ppc.createNewPage(room);
				}
				ppc.finish();
			} catch (DocumentException | IOException e) {
				e.printStackTrace();
			}

			FileOp.deleteDir(tempDir);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}
