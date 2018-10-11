package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.seleniumhq.jetty9.server.ResponseWriter;

import java.io.IOException;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.User;
import com.ConsultantTracker.util.GeneratePassword;

/**
 * Servlet implementation class CreateUser
 */
public class CreateUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateUser() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    //for creating a new user based on the consultant details
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		GeneratePassword generatePassword = new GeneratePassword();
		String password = request.getParameter("passw");
		String consultantID = request.getParameter("conID");
		String securityQ = request.getParameter("question");
		String answer = request.getParameter("answer");
		String resetPassword = request.getParameter("resetpassword");
		boolean completed = false;

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		User newUser= em.find(User.class, Integer.parseInt(consultantID));
		if (newUser == null) {
			newUser = new User();
			password = generatePassword.generatePassword(5);
		}
		else {
			if (resetPassword == null) {
				completed = true;
				newUser.setCompleted(completed);
				newUser.setSecurity_Answer(answer);
				newUser.setSecurity_Question(securityQ);	
			}
		}
		Consultant consultant = em.find(Consultant.class, Integer.parseInt(consultantID));
		if (consultant != null)
			newUser.setConsultant_ID(consultant);
		newUser.setPassword(password);
		
		em.getTransaction().begin();
		em.persist(newUser);
		em.getTransaction().commit();
		
		em.refresh(newUser);
		PrintWriter out = response.getWriter();
		out.write(String.valueOf(password));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}


