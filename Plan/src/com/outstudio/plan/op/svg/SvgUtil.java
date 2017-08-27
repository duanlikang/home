package com.outstudio.plan.op.svg;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.Writer;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.batik.transcoder.svg2svg.SVGTranscoder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

public class SvgUtil {

	/**
	 * 将svg标签转换为png并输出到指定位置 成功返回true，失败返回false
	 * 注：svg必须指定合适的height和width,否则转换输出的png会只有svg的一部分
	 * 
	 * @param doc
	 * @throws Exception
	 */
	public static boolean outputSvgDocToPng(Document doc, String fpath) {
		try {
			PNGTranscoder transcoder = new PNGTranscoder();
			// transcoder.addTranscodingHint(PNGTranscoder.KEY_WIDTH, new
			// Float(2000));
			// transcoder.addTranscodingHint(PNGTranscoder.KEY_HEIGHT, new
			// Float(1000));
			// 96dpi
			// transcoder.addTranscodingHint(ImageTranscoder.KEY_PIXEL_TO_MM,
			// new Float(0.3528f));
			TranscoderInput input = new TranscoderInput(doc);
			OutputStream ostream = new FileOutputStream(new File(fpath));
			TranscoderOutput output = new TranscoderOutput(ostream);
			transcoder.transcode(input, output);
			ostream.flush();
			ostream.close();
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		} catch (TranscoderException e) {
			e.printStackTrace();
			return false;
		}

		return true;
	}

	/**
	 * 输出svg
	 * 
	 * @param doc
	 * @param fpath
	 */
	public static void outputSvg(Document doc, String fpath) {
		try {
			SVGTranscoder transcoder = new SVGTranscoder();
			TranscoderInput input = new TranscoderInput(doc);
			Writer ostream = new FileWriter(new File(fpath));
			TranscoderOutput output = new TranscoderOutput(ostream);
			transcoder.transcode(input, output);
			ostream.flush();
			ostream.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TranscoderException e) {
			e.printStackTrace();
		}

	}

	/**
	 * !未测试,一直失败 将svg标签转换为png,jpg,tiff并输出到指定位置 成功返回true，失败返回false
	 * 
	 * @param doc
	 * @throws Exception
	 */
	public static boolean outputJpg(String svgPath, String fpath) {
		try {
			// Create a JPEG transcoder
			JPEGTranscoder t = new JPEGTranscoder();
			// Set the transcoding hints.
			t.addTranscodingHint(JPEGTranscoder.KEY_QUALITY, new Float(.8));
			t.addTranscodingHint(JPEGTranscoder.KEY_HEIGHT, new Float(1000));
			t.addTranscodingHint(JPEGTranscoder.KEY_WIDTH, new Float(5000));
			// Create the transcoder input.
			String svgURI = new File(svgPath).toURL().toString();
			TranscoderInput input = new TranscoderInput(svgURI);

			// Create the transcoder output.
			OutputStream ostream = new FileOutputStream(fpath);
			TranscoderOutput output = new TranscoderOutput(ostream);

			// Save the image.
			t.transcode(input, output);

			// Flush and close the stream.
			ostream.flush();
			ostream.close();
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		} catch (TranscoderException e) {
			e.printStackTrace();
			return false;
		}

		return true;
	}

	/**
	 * 将内存中的数据保存到XML文件中
	 * 
	 * @param document
	 * @param xmlPath
	 * @throws TransformerException
	 */
	public static void writeXml(Document document, String xmlPath) throws TransformerException {

		DOMSource source = new DOMSource(document);
		StreamResult result = new StreamResult(new File(xmlPath));

		TransformerFactory factory = TransformerFactory.newInstance();
		Transformer trans = factory.newTransformer();
		trans.transform(source, result);

	}

	public static void printSvg(Document document) throws TransformerException {

		DOMSource source = new DOMSource(document);
		StreamResult result = new StreamResult(System.out);

		TransformerFactory factory = TransformerFactory.newInstance();
		Transformer trans = factory.newTransformer();
		trans.transform(source, result);
		System.out.println("\n");
	}

	public static String svgToString(Document document) throws TransformerException, IOException {

		String svg = "";
		Writer os = new StringWriter();
		DOMSource source = new DOMSource(document);
		StreamResult result = new StreamResult(os);

		TransformerFactory factory = TransformerFactory.newInstance();
		Transformer trans = factory.newTransformer();
		trans.transform(source, result);

		svg = os.toString();
		os.flush();
		os.close();

		return svg;
	}

	/**
	 * 将Node转化为svg字符串打印并返回。
	 * 
	 * @param node
	 * @return
	 * @throws TransformerException
	 * @throws IOException
	 */
	public static String NodeToString(Node node) throws TransformerException, IOException {
		SVGDOMImplementation dom = new SVGDOMImplementation();
		Document doc = dom.createDocument(dom.SVG_NAMESPACE_URI, "svg", null);
		Element root = doc.getDocumentElement();
		Element impNode = (Element) doc.importNode(node, true);
		root.appendChild(impNode);

		String svg = svgToString(doc);
		System.out.println(svg);
		return svg;

	}
}
