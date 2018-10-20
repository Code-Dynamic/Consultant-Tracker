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

import com.ConsultantTracker.model.Assigned_Task;
import com.ConsultantTracker.model.Daily_Times;
import com.ConsultantTracker.model.Project;

/**
 * Servlet implementation class GetProjectProgress
 */
@WebServlet("/GetProjectProgress")
public class GetProjectProgress extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public GetProjectProgress() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String proj_Name = request.getParameter("Project_Id");	//set project Name from request

		int projID = Integer.parseInt(proj_Name);

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();

		java.util.List<Assigned_Task> projectTaskList = em.createQuery("SELECT a FROM Assigned_Task a JOIN a.task t JOIN t.project p where p.project_ID = :project",Assigned_Task.class)
				.setParameter("project",projID).getResultList();

		Double TotalAssigned=0.0,TotalDone =0.0;
		if(projectTaskList != null){
			String ObjToReturn="";
			for(int i=0;i<projectTaskList.size();i++) {				// build return string based on query response
				Assigned_Task a = projectTaskList.get(i);
				if(!ObjToReturn.equals(""))
					ObjToReturn +=";";
				TotalAssigned +=a.getAssigned_Hours();
				TotalDone += a.getHours_Worked();

			}
			Double Percentage;
			if(TotalAssigned>0)
				Percentage = TotalDone/TotalAssigned*100;
			else
				Percentage = 0.0;
			ObjToReturn += Percentage.toString();
			PrintWriter out = response.getWriter();

			response.setContentType("text/plain");
			out.write(ObjToReturn);	// return response
		}else{
			RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
			PrintWriter out= response.getWriter();

			out.write("SQL Query Failed for DeleteProject.");
			rd.include(request, response);
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
