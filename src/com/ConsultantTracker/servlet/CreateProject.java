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
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Project;
import com.gargoylesoftware.htmlunit.javascript.host.Console;

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
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		String proj = request.getParameter("ID");
		int proj_ID;
		Project p;
		if(proj!=null && !proj.isEmpty()) {
			proj_ID = Integer.parseInt(proj);
			p= em.find(Project.class, proj_ID);
		}else
			p = new Project();
		
			
		String proj_Name = request.getParameter("Name");	
		String ClientID = request.getParameter("ClientID");
		int c_ID =Integer.parseInt(ClientID);
		String Proj_Desc = request.getParameter("Desc");
		int pCreator = Integer.parseInt(request.getParameter("Project_Creator"));
		
		String Proj_Deadl = request.getParameter("Deadl");
		String Proj_StartDate = request.getParameter("StartDate");
		
		System.out.println(Proj_StartDate);
		SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd");
		Date Deadline = new Date();
		Date StartDate = new Date();
		try {
			Deadline = sdf.parse(Proj_Deadl);
			StartDate = sdf.parse(Proj_StartDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		boolean onSite = Boolean.parseBoolean(request.getParameter("OnSite"));		

		Client client = em.find(Client.class, c_ID);
		Consultant consultant = em.find(Consultant.class, pCreator);
		
		if(client != null) {
			p.setProject_Name(proj_Name);
			p.setProject_Deadline(Deadline);
			p.setProject_StartDate(StartDate);
			p.setProject_Deleted(false);
			p.setProject_Description(Proj_Desc);
			p.setClient_ID(client);
			p.setProject_OnSite(onSite);
			p.setProject_Creator(consultant);
	

			em.getTransaction().begin();
			em.persist(p);
			em.getTransaction().commit();
			response.getWriter().write("Success: new Project Added");
		}
		else {
			response.getWriter().write("Error: No Client Found");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		doGet(request, response);
	}

}
