package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * Servlet implementation class EnterDailyTimes
 */
public class EnterDailyTimes extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EnterDailyTimes() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Date javaDate = new Date();
		java.sql.Date today = new java.sql.Date(javaDate.getTime());
		
		String Consultant_ID = request.getParameter("Consultant_ID");	//set project Name from request
		//System.out.println(request.getParameter("Hours_Worked"));
		double general = Double.parseDouble(request.getParameter("general"));
		double totalTasks = Double.parseDouble(request.getParameter("totalTasks"));
		
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		try {
			ps = con.prepareStatement("INSERT INTO daily_times (DATE,GENERAL_TIME,TOTAL_ASSIGNED_TASKS_TIME," +
					"CONSULTANT_CONSULTANT_ID) VALUES (?,?,?,?);");		//create prepared sql statement	
			
			ps.setDate(1, today);
			ps.setDouble(2, general);
			ps.setDouble(3, totalTasks);
			ps.setString(4, Consultant_ID);
			ps.executeUpdate();				// execute sql query
			
			PrintWriter out = response.getWriter();
			
			response.setContentType("text/plain");
			out.write("Times entered successfully");
			
		} catch (SQLException e) {
			e.printStackTrace();
			//logger.error("Database connection problem");
			throw new ServletException("DB Connection problem.");
		}finally{
			try {
				ps.close();
			} catch (SQLException e) {
				//logger.error("SQLException in closing PreparedStatement or ResultSet");;
			}
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
