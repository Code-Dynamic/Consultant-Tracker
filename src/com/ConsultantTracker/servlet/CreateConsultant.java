package com.ConsultantTracker.servlet;

import java.io.Console;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.User_Type;

//import org.apache.log4j.Logger;

@WebServlet("/CreateConsultant")
public class CreateConsultant extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String conID = request.getParameter("conID");
		String name = request.getParameter("name");
		String surname = request.getParameter("surname");
		String email = request.getParameter("email");
		String cell = request.getParameter("cell");
		int adminPriv = Integer.parseInt(request.getParameter("admin"));
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Consultant c;
		if (conID == null)
			c = new Consultant();
		else
			c  = em.find(Consultant.class, Integer.parseInt(conID)); 
		c.setConsultant_Name(name);
		c.setConsultant_Surname(surname);
		c.setConsultant_Email(email);
		c.setConsultant_Cell(cell);
//		Consultant c = em.find(Consultant.class, Integer.parseInt(consultant));
		User_Type usrType = em.find(User_Type.class, adminPriv);
		if (usrType != null) {
			c.setConsultant_Priviledge(usrType);
			em.getTransaction().begin();
			em.persist(c);
			em.getTransaction().commit();	
			
			PrintWriter out = response.getWriter();
			out.write(String.valueOf(c.getConsultant_ID()));
		}
		else {
			throw new ServletException("Invalid");
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}	
	

}