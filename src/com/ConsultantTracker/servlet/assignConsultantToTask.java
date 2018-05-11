package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;

import javax.print.DocFlavor.STRING;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class assignConsultantToTask
 */
@WebServlet("/assignConsultantToTask")
public class assignConsultantToTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public assignConsultantToTask() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int taskID= Integer.parseInt(request.getParameter("taskID"));
		int assignedHours = Integer.parseInt(request.getParameter("assignedHours"));
		int hoursWorked = Integer.parseInt(request.getParameter("hoursWorked"));
		int consultantID = Integer.parseInt(request.getParameter("consultantID"));
		String dateAssigned = request.getParameter("dateAssigned");
		String dueDate = request.getParameter("dueDate");

		LocalDate date = LocalDate.now();
		java.sql.Date sqlDate = java.sql.Date.valueOf( date );
		Connection con = (Connection) getServletContext().getAttribute("DBConnection");
		PreparedStatement ps = null;
		try {
			
			ps = con.prepareStatement("INSERT INTO assigned_task (DATE_ASSIGNED, DUE_DATE, ASSIGNED_HOURS, HOURS_WORKED, LAST_UPDATE, CONSULTANT_CONSULTANT_ID, TASK_TASK_ID) VALUES (?, ?, ?, ?,?,?,?)");
			ps.setString(1, dateAssigned);
			ps.setString(2, dueDate);
			ps.setInt(3, assignedHours);
			ps.setInt(4, hoursWorked);
			ps.setDate(5, sqlDate);
			ps.setInt(6, consultantID);
			ps.setInt(7, taskID);
			ps.executeUpdate();
			//sends success message back if user is stored successfully 
			String ObjToReturn = "Assigned task succesfully!" ;
			response.setContentType("text/plain");
			response.getWriter().write(ObjToReturn);
			

		} catch (SQLException e) {
			e.printStackTrace();
			//logger.error("Database connection problem");
			throw new ServletException("DB Connection problem.");
		}finally{
			try {
				if (ps!= null)
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
