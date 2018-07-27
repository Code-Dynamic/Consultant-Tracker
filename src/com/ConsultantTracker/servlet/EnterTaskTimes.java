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
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assigned_Task;

/**
 * Servlet implementation class EnterTaskTimes
 */
public class EnterTaskTimes extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EnterTaskTimes() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		
		String AssignedTaskID = request.getParameter("Assigned_Task_ID");	//set project Name from request
		//System.out.println(request.getParameter("Hours_Worked"));
		//int HoursWorked = Integer.parseInt(request.getParameter("Hours_Worked"));
		double HoursWorked = Double.parseDouble(request.getParameter("Hours_Worked"));
		//System.out.println(AssignedTaskID);

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Assigned_Task aT = em.find(Assigned_Task.class, Integer.parseInt(AssignedTaskID));
		
		aT.setHours_Worked(HoursWorked);
		em.getTransaction().begin();
		em.persist(aT);
		em.getTransaction().commit();
		
//		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
//		PreparedStatement ps = null;
//		try {
//			ps = con.prepareStatement("UPDATE assigned_task SET HOURS_WORKED = ? WHERE ASSIGNED_TASK_ID = ?");		//create prepared sql statement	
//			
//			ps.setDouble(1, HoursWorked);
//			ps.setString(2, AssignedTaskID);
//			ps.executeUpdate();				// execute sql query
//			
//			PrintWriter out = response.getWriter();
//			
//			response.setContentType("text/plain");
//			out.write("Times updated successfully");
//			
//		} catch (SQLException e) {
//			e.printStackTrace();
//			//logger.error("Database connection problem");
//			throw new ServletException("DB Connection problem.");
//		}finally{
//			try {
//				ps.close();
//			} catch (SQLException e) {
//				//logger.error("SQLException in closing PreparedStatement or ResultSet");;
//			}
//		}		
//		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
