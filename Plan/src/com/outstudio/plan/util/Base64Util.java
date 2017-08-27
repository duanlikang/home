package com.outstudio.plan.util;

import java.io.IOException;

import Decoder.BASE64Decoder;
import Decoder.BASE64Encoder;

public class Base64Util {

	private static BASE64Encoder encoder = new BASE64Encoder();
	private static BASE64Decoder decoder = new BASE64Decoder();

	public static String base64Encode(String raw) {
		return encoder.encode(raw.getBytes());
	}

	public static String base64Decode(String encoded) {
		byte[] b = decode(encoded);
		return (b == null) ? null : new String(b);
	}

	public static String encode(byte[] b) {
		return encoder.encode(b);
	}

	public static byte[] decode(String encoded) {
		if (encoded == null) {
			return null;
		}

		try {
			return decoder.decodeBuffer(encoded);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	public static void main(String[] args) throws Exception {

		String str = AESCodec.decrypt("I6wr/0bah8B9QtkFvhx+YfOO2Nm/LzUZg8E+QnyCqnU=", "yETWedDzLh377ZBfQpwoSQ==");
		System.out.println(str);

		String raw = "ODAmMSYxNDMwOTk0NzE1ODc4JjYwMyY0MDQmQ2hyb21lIDQxLjAuMjI3Mi44OSYtMC41NTk5OTk5OTk5OTk5NDU0";
		String s = Base64Util.base64Decode(raw);
		System.out.println(s);

		System.out.println(base64Decode(
				"MjAwJjEmMTQzMDk5NDgzNTgxNyY2NjAmNDg3JkNocm9tZSA0MS4wLjIyNzIuODkmLTAuNTU5OTk5OTk5OTk5OTQ1NA=="));
		System.out.println(base64Decode(
				"MzIwJjEmMTQzMDk5NDk1NTc4OCY2NjAmNDg3JkNocm9tZSA0MS4wLjIyNzIuODkmLTAuNTU5OTk5OTk5OTk5OTQ1NA=="));
		System.out.println(base64Decode(
				"MzYxJjEmMTQzMDk5NTA3NTc5MCY2NjAmNDg3JkNocm9tZSA0MS4wLjIyNzIuODkmLTAuNTU5OTk5OTk5OTk5OTQ1NA=="));
		System.out.println(base64Decode(
				"MTQxMiYyJjE0MzA5OTYzMjI0NzMmNDM2JjI5OSZDaHJvbWUgNDEuMC4yMjcyLjg5Ji0wLjU1OTk5OTk5OTk5OTk0NTQ="));
	}

}
