package com.outstudio.plan.main;

import java.io.IOException;
import java.util.List;

import net.sf.json.JSONObject;

import org.w3c.dom.Document;

import com.itextpdf.text.DocumentException;
import com.outstudio.plan.op.pdf.PDFPageCreater;
import com.outstudio.plan.op.pdf.model.Room;
import com.outstudio.plan.op.svg.JsonOp;
import com.outstudio.plan.op.svg.PrimaryJsonPaser;
import com.outstudio.plan.op.svg.SvgOp;
import com.outstudio.plan.op.svg.SvgParseUtil;
import com.outstudio.plan.op.svg.SvgUtil;
import com.outstudio.plan.util.FileOp;

public class Svg2Pdf {

	public static void main(String[] args) {

		String jsonPath = "A:/TestData/svg/svg201607101640.txt";
		JSONObject js = SvgParseUtil.readJson(jsonPath);
		generate(js.toString(), "E:/", "报价单", "A:\\TestData\\svg", "/ext/", "A:\\TestData\\svg", "E://temp1");
		generateForRoom(js.toString(), "E:/", "房间缩略图", "A:\\TestData\\svg", "/ext/", "A:\\TestData\\svg", "E://temp2");
	}

	public static boolean generate(String jsonString, String outputDir, String outputName, String extDirPath,
			String extDirName, String imgPath, String tempDir) {

		try {
			if (!extDirName.startsWith("/")) {
				extDirName = "/" + extDirName;
			}
			if (!extDirName.endsWith("/")) {
				extDirName = extDirName + "/";
			}

			FileOp.createTempDir(tempDir);

			// 设置在目标目录下存放额外txt的文件夹
			PrimaryJsonPaser.setExtDirName(extDirName);
			// 设置外部引入图片的文件夹路径，已有相对路径。例：（/file/second_cut/7239280614de718a62a0076e3d8cc93a.jpg"）
			PrimaryJsonPaser.setImgPath(imgPath);
			Document doc = JsonOp.transtxt(jsonString, extDirPath, extDirName, null, null);

			// SvgUtil.outputSvgDocToPng(doc, "E://svg2png.png");
			// SvgUtil.outputSvg(doc, "E://svg2svg.svg");
			// SvgUtil.outputJpg("E://svg2svg.svg", "E://svg2jpeg.jpeg");
			// try {
			// System.out.println("svg create finish!");
			// SvgUtil.printSvg(doc);
			// } catch (Exception e) {
			// e.printStackTrace();
			// }

			PDFPageCreater ppc = new PDFPageCreater();
			ppc.start(outputDir, outputName + ".pdf");
			String AbsolutelyPdfPath = outputDir + outputName + ".pdf";
			SvgOp so = new SvgOp(tempDir);
			// HomePage hp = so.getHomePage(doc);
			List<Room> rooms = so.getRoom(doc);

			try {
				// 计算该项目的总价
				float price = 0;
				for (Room room : rooms) {
					price += room.getFurnsTotalPrice();
				}
				// hp.setTotalPrice(price);
				// 生成主页
				// ppc.createMainPage(hp);
				// 生成各个房间信息
				for (int i = 0; i < rooms.size(); i++) {
					Room room = rooms.get(i);
					if (i == rooms.size() - 1) {
						ppc.createNewPage(room, true, price + "");
					} else {
						ppc.createNewPage(room);
					}
				}
				System.out.println("pdf saved in " + AbsolutelyPdfPath);
			} catch (DocumentException | IOException e) {
				e.printStackTrace();
			} finally {
				ppc.finish();
			}

			// 加水印
			// new WaterMarker(outputDir + outputName + "_temp.pdf", outputDir +
			// outputName + ".pdf").addTextWaterMarker(
			// "U S U - 优 速 M a x", 60);
			// FileOp.deleteFile(outputDir + outputName + ".pdf");

			FileOp.deleteDir(tempDir);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public static boolean generateForRoom(String jsonString, String outputDir, String outputName, String extDirPath,
			String extDirName, String imgPath, String tempDir) {

		try {
			if (!extDirName.startsWith("/")) {
				extDirName = "/" + extDirName;
			}
			if (!extDirName.endsWith("/")) {
				extDirName = extDirName + "/";
			}

			FileOp.createTempDir(tempDir);

			// 设置在目标目录下存放额外txt的文件夹
			PrimaryJsonPaser.setExtDirName(extDirName);
			// 设置外部引入图片的文件夹路径，已有相对路径。例：（/file/second_cut/7239280614de718a62a0076e3d8cc93a.jpg"）
			PrimaryJsonPaser.setImgPath(imgPath);
			Document doc = JsonOp.transtxt(jsonString, extDirPath, extDirName, null, null);

			try {
				System.out.println("svg create finish!");
				SvgUtil.printSvg(doc);
			} catch (Exception e) {
				e.printStackTrace();
			}

			PDFPageCreater ppc = new PDFPageCreater();
			ppc.start(outputDir, outputName + ".pdf");
			String AbsolutelyPdfPath = outputDir + outputName + ".pdf";
			SvgOp so = new SvgOp(tempDir);
			List<Room> rooms = so.getRoom(doc);
			try {
				for (Room room : rooms) {
					ppc.createRoomPageOnly(room);
				}
				System.out.println("pdf saved in " + AbsolutelyPdfPath);
			} catch (DocumentException | IOException e) {
				e.printStackTrace();
			} finally {
				ppc.finish();
			}

			// 加水印
			// new WaterMarker(outputDir + outputName + "_temp.pdf", outputDir +
			// outputName + ".pdf").addTextWaterMarker(
			// "U S U - 优 速 M a x", 60);
			// FileOp.deleteFile(outputDir + outputName + ".pdf");

			FileOp.deleteDir(tempDir);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
