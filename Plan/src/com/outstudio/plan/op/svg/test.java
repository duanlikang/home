package com.outstudio.plan.op.svg;

import java.io.IOException;

import javax.xml.transform.TransformerException;

import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.w3c.dom.Document;

public class test {

	public static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;

	public static void main(String[] args) throws IOException {
		testRoom();
	}

	public static void testRoom() {
		Document doc = JsonOp.trans("E:/svg/svg20160124.txt", "E:/svg", "/extJson/");
		// SvgUtil.outputSvgDocToPng(doc, "E://png0221.png");
		try {
			System.out.println("main svg:");
			SvgUtil.printSvg(doc);
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		SvgOp so = new SvgOp("E://svgTemp");
		so.getRoom(doc);
	}

}
