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
		String password = generatePassword.generatePassword(5);
		String consultantID = request.getParameter("conID");

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		User newUser = new User();
		Consultant consultant = em.find(Consultant.class, Integer.parseInt(consultantID));
		if (consultant != null)
			newUser.setConsultant_ID(consultant);
		else
			System.out.println("Couldn't find the consultant ID");
		newUser.setPassword(password);
		
		em.getTransaction().begin();
		em.persist(newUser);
		em.getTransaction().commit();
		
		em.refresh(newUser);
		PrintWriter out = response.getWriter();
		out.write(String.valueOf(newUser.getPassword()));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}


