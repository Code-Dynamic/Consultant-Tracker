package com.ConsultantTracker.servlet;

import java.io.IOException;
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

	//static Logger logger = Logger.getLogger(LoginServlet.class);
	
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
//		error handling done at front-end......confirm
//		String errorMsg = null;
//		if(email == null || email.equals("")){
//			errorMsg ="User Email can't be null or empty";
//		}
//		
//		if(errorMsg != null){
//			RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
//			PrintWriter out= response.getWriter();
//			out.println("<font color=red>"+errorMsg+"</font>");
//			rd.include(request, response);
//		}else{

		
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
		
	
	
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}	
	

}