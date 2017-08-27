package com.outstudio.plan.util;

import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

/**
 * <p>
 * Title: 使用javamail发送邮件
 * </p>
 */
public class EmailUtil {

	String from = "usu@usuapp.com";// 发件人
	String host = "smtp.qiye.163.com";// smtp主机
	String username = "usu@usuapp.com";
	String password = "Usu80013";
	Transport transport;
	Session session;
	public static final EmailUtil me = new EmailUtil();

	public EmailUtil() {
		Properties props = new Properties();
		props.put("mail.smtp.host", host);
		props.put("mail.smtp.auth", "true");
		session = Session.getDefaultInstance(props, new Authenticator() {
			public PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
		try {
			transport = session.getTransport("smtp");
			transport.connect(host, username, password);
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public String transferChinese(String strText) {
		try {
			strText = MimeUtility.encodeText(new String(strText.getBytes(), "GBK"), "GBK", "B");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return strText;
	}

	public boolean sendMail(String to, String subject, String content, String file) {

		try {
			// 构造MimeMessage 并设定基本的值
			MimeMessage msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress(from));
			msg.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(to));
			subject = transferChinese(subject);
			msg.setSubject(subject);
			Multipart mp = new MimeMultipart();
			MimeBodyPart mbpContent = new MimeBodyPart();
			mbpContent.setContent(content, "text/html;charset=utf-8");
			mp.addBodyPart(mbpContent);
			if (!StringUtil.isBlank(file)) {
				MimeBodyPart mbpFile = new MimeBodyPart();
				FileDataSource fds = new FileDataSource(file);
				mbpFile.setDataHandler(new DataHandler(fds));
				String filename = new String(fds.getName().getBytes(), "utf-8");
				mbpFile.setFileName(filename);
				mp.addBodyPart(mbpFile);
			}
			msg.setContent(mp);
			msg.setSentDate(new Date());
			msg.saveChanges();
			// 发送邮件
			synchronized (this) {
				if (!transport.isConnected()) {
					transport.connect();
				}
				transport.sendMessage(msg, msg.getAllRecipients());
			}
		} catch (Exception mex) {
			mex.printStackTrace();
			return false;
		}
		return true;
	}

	public static boolean sendFile(String path, String email) {
		return EmailUtil.me.sendMail(email, "你好，这是项目的pdf", "你好，这是项目的pdf", path);
	}

	public static boolean notify(String content) {
		return EmailUtil.me.sendMail("393823583@qq.com", "订单通知", content, null);
	}

	public static void main(String[] args) throws InterruptedException {
		EmailUtil.me.sendFile("D:/1.txt", "liuchuanyangyan@163.com");
		Thread.sleep(60 * 1000);
		EmailUtil.me.sendFile("D:/1.txt", "liuchuanyangyan@163.com");
	}
}