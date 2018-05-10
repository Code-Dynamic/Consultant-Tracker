package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class createTask
 */
public class createTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public createTask() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int taskID= Integer.parseInt(request.getParameter("taskID"));
		String description= request.getParameter("description");
		String dueDate = request.getParameter("dueDate");
		String name = request.getParameter("name");
		int projectID = Integer.parseInt(request.getParameter("projectID"));
		Connection con = (Connection) getServletContext().getAttribute("DBConnection");
		PreparedStatement ps = null;
		try {
			
			ps = con.prepareStatement("INSERT INTO task (taskID, description, due_date, name, project_project_id) VALUES (?, ?, ?, ?, ?)");
			ps.setInt(1, taskID);
			ps.setString(2, description);
			ps.setString(3, dueDate);
			ps.setString(4, name);
			ps.setInt(5, projectID);
			ps.executeUpdate();
			//**sends success message back if user is stored successfully 
			String ObjToReturn = "Task created succesfully!" ;
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
