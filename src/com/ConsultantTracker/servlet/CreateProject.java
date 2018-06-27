package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Client;
import com.ConsultantTracker.model.Project;

//import static java.lang.System.out;
/**
 * Servlet implementation class CreateProject
 * Required Parameters: Name (Project Name), ClientID (Client Identifier),Desc (Project Description)
 * 						Deadl (Project deadline of form yyyy/mm/dd), OnSite (is the project on site)
 * 
 * Successful Return: 
 * 			String of form: Project_Name,Project_Description,Project_Deadline ; Project_Name,Project_Description,Project_Deadline ...
 */
@WebServlet("/CreateProject")
public class CreateProject extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateProject() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String proj_Name = request.getParameter("Name");	
		String ClientID = request.getParameter("ClientID");
		int c_ID =Integer.parseInt(ClientID);
		String Proj_Desc = request.getParameter("Desc");
		
		String Proj_Deadl = request.getParameter("Deadl");
		SimpleDateFormat sdf =new SimpleDateFormat("dd-mm-yyyy");
		Date Deadline = new Date();
		try {
			Deadline = sdf.parse(Proj_Deadl);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		boolean onSite = Boolean.parseBoolean(request.getParameter("OnSite"));
		int on_Site = Integer.parseInt(request.getParameter("OnSite"));

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		

		Client c = em.find(Client.class, c_ID);
		if(c != null) {
			Project p = new Project();
			p.setProject_Name(proj_Name);
			p.setProject_Deadline(Deadline);
			p.setProject_Deleted(false);
			p.setProject_Description(Proj_Desc);
			p.setClient_ID(c);
			p.setProject_OnSite(onSite);
	

			em.getTransaction().begin();
			em.persist(p);
			em.getTransaction().commit();
			response.getWriter().write("Successd: new Project Added");
		}
		else {
			response.getWriter().write("Error: No Client Found");
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
