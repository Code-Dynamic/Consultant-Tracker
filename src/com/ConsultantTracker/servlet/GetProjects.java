package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
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

import com.ConsultantTracker.model.Daily_Times;
import com.ConsultantTracker.model.Project;




/**
 * Servlet implementation class GetProjects
 * 
 * returns string in the form 'Project_Name','Project_Description','Client_Name','Project_Deadline,'Project_OnSite'
 */
//Replaced with Odata Service
@WebServlet("/GetProjects")
public class GetProjects extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetProjects() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		java.util.List<Project> projectList = em.createQuery("select * from projects where Project_Deleted = 0",Project.class).getResultList();
		String ObjToReturn="";
		for(int i=0;i<projectList.size();i++) {
			Project p = projectList.get(i);
			if(!ObjToReturn.equals(""))
				ObjToReturn +=";";
			
			ObjToReturn +=p.getProject_Name()+','+p.getProject_Description()+','+p.getClient_ID().getClient_Name()+','+p.getProject_Deadline()+','+p.getProject_OnSite()+','+p.getProject_ID();
			PrintWriter out = response.getWriter();
			
			response.setContentType("text/plain");
			response.getWriter().write(ObjToReturn);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
