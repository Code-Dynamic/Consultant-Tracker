package com.ConsultantTracker.servlet;

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

//import org.apache.log4j.Logger;

@WebServlet("/createConsultant" )
public class createConsultant extends HttpServlet {
	private static final long serialVersionUID = 1L;


	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Entereed create consultant servlet");
		String name = request.getParameter("name");
		String surname = request.getParameter("surname");
		String email = request.getParameter("email");
		String cell = request.getParameter("cell");
		String adminStr = request.getParameter("admin");
		Boolean admin = false;
		if(adminStr.equals("1")) {
			admin = true;
		}
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Consultant c = new Consultant();
		c.setConsultant_Name(name);
		c.setConsultant_Surname(surname);
		c.setConsultant_email(email);
		c.setConsultant_Cell(cell);
		int ad =0;
		if(admin)
			ad =1;
		c.setConsultant_Admin(ad);
		em.getTransaction().begin();
		em.persist(c);
		em.getTransaction().commit();
		
		em.refresh(c);
		PrintWriter out = response.getWriter();
		out.write(String.valueOf(c.getConsultant_ID()));
	
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}	
	

}