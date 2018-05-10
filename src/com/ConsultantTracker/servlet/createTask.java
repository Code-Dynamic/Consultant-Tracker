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
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String description= request.getParameter("description");
		String dueDate = request.getParameter("dueDate");
		String name = request.getParameter("name");
		int projectID = Integer.parseInt(request.getParameter("projectID"));
		Connection con = (Connection) getServletContext().getAttribute("DBConnection");
		PreparedStatement ps = null;
		try {
			
			ps = con.prepareStatement("INSERT INTO task (description, due_date, name, project_project_id) VALUES (?, ?, ?, ?)");
			ps.setString(1, description);
			ps.setString(2, dueDate);
			ps.setString(3, name);
			ps.setInt(4, projectID);
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
		doGet(request, response);
	}

}
