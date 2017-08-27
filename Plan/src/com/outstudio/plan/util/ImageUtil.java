package com.outstudio.plan.util;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.awt.image.CropImageFilter;
import java.awt.image.FilteredImageSource;
import java.awt.image.ImageFilter;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

public class ImageUtil {

	public static final String IMAGE_TYPE_GIF = "gif";
	public static final String IMAGE_TYPE_JPG = "jpg";
	public static final String IMAGE_TYPE_JPEG = "jpeg";
	public static final String IMAGE_TYPE_BMP = "bmp";
	public static final String IMAGE_TYPE_PNG = "png";
	public static final String IMAGE_TYPE_PSD = "psd";

	public static void scale(File fromFile, File toFile, int height, int width, String formatName, boolean bb)
			throws IOException {
		double ratio = 0.0;
		System.out.println(height + " " + width);
		BufferedImage bi = ImageIO.read(fromFile);
		Image itemp = bi.getScaledInstance(width, height, BufferedImage.SCALE_DEFAULT);
		if ((bi.getHeight() > height) || (bi.getWidth() > width)) {
			double heightRatio = (new Integer(height)).doubleValue() / bi.getHeight();
			double widthRatio = (new Integer(width)).doubleValue() / bi.getWidth();
			if (heightRatio < widthRatio) {
				ratio = heightRatio;
			} else {
				ratio = widthRatio;
			}
			AffineTransformOp op = new AffineTransformOp(AffineTransform.getScaleInstance(ratio, ratio), null);
			itemp = op.filter(bi, null);
		} else {
			itemp = bi;
		}
		if (bb) {
			BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics2D g = image.createGraphics();
			g.setColor(Color.white);
			g.fillRect(0, 0, width, height);
			if (width == itemp.getWidth(null))
				g.drawImage(itemp, 0, (height - itemp.getHeight(null)) / 2, itemp.getWidth(null), itemp.getHeight(null),
						Color.white, null);
			else
				g.drawImage(itemp, (width - itemp.getWidth(null)) / 2, 0, itemp.getWidth(null), itemp.getHeight(null),
						Color.white, null);
			g.dispose();
			itemp = image;
		}
		ImageIO.write((BufferedImage) itemp, formatName, toFile);
	}

	public static void cut(File fromFile, File toFile, int x, int y, int width, int height, String formatName)
			throws IOException {
		BufferedImage bi = ImageIO.read(fromFile);
		int srcHeight = bi.getHeight();
		int srcWidth = bi.getWidth();
		if (srcWidth > 0 && srcHeight > 0) {
			Image image = bi.getScaledInstance(srcWidth, srcHeight, Image.SCALE_DEFAULT);
			ImageFilter cropFilter = new CropImageFilter(x, y, width, height);
			Image img = Toolkit.getDefaultToolkit().createImage(new FilteredImageSource(image.getSource(), cropFilter));
			BufferedImage tag = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics g = tag.getGraphics();
			g.drawImage(img, 0, 0, width, height, null);
			g.dispose();
			ImageIO.write(tag, formatName, toFile);
		}
	}

	public static void convert(File fromFile, File toFile, String formatName) throws IOException {
		fromFile.canRead();
		fromFile.canWrite();
		BufferedImage src = ImageIO.read(fromFile);
		ImageIO.write(src, formatName, toFile);
	}
}
