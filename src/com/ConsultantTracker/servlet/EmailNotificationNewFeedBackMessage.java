package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.util.GeneratePassword;

public class EmailNotificationNewFeedBackMessage  extends HttpServlet {
	private static final long serialVersionUID = 1L;
	/**
     * @see HttpServlet#HttpServlet()
     */
    public EmailNotificationNewFeedBackMessage() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		final String username = "codedynamiccos301@gmail.com";
		final String password = "codeDynamic6";

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props,
		  new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
		try {
			//gather user name, email address and group name that will now contain the new details
			String toConsultant = request.getParameter("toConsultant");
			String emailAddress = request.getParameter("emailAddress");
			String fromConsultant = request.getParameter("fromConsultant");
			
			GeneratePassword generatePassword = new GeneratePassword();
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("codedynamiccos301@gmail.com"));
			message.setRecipients(Message.RecipientType.TO,
				InternetAddress.parse(emailAddress));
			message.setSubject("You have been to a team");
			message.setText("Dear " + toConsultant +
					"\n\n You have recieved a new feedback messaged from "+ fromConsultant +".\n\n");
					
			Transport.send(message);
			System.out.println("Email successfully sent to: " + emailAddress);

		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
}
