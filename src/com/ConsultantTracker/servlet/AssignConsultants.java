package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class AssignConsultants
 */
@WebServlet("/AssignConsultants")
public class AssignConsultants extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AssignConsultants() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String projectID = (request.getParameter("project"));
		String consultantID = (request.getParameter("consultant"));
		Connection connection = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement statement = null;
		ResultSet set = null;
		
		try {
		
			statement = connection.prepareStatement("INSERT INTO assignment(Project_ID, Consultant_ID) VALUES(?,?)");
			statement.setString(1, projectID);
			statement.setString(2, consultantID);
			statement.executeUpdate();	// execute sql query
			statement.close();
			
			//see if it was inserted into the database
			statement = connection.prepareStatement("SELECT * FROM assignment WHERE Project_ID = ? and Consultant_ID = ?");
			statement.setString(1, projectID);
			statement.setString(2, consultantID);
			set = statement.executeQuery();
			
			String ObjToReturn = "Done";
			if(set != null) {
				while(set.next())
					ObjToReturn=set.getString("Assignment_ID") + ", " + set.getString("Project_ID") + ", " + set.getString("Consultant_ID");
					//PrintWriter out = response.getWriter();
			}
			else
				ObjToReturn = "rs is null???";
			
				response.setContentType("text/plain");
				response.getWriter().write(ObjToReturn);	// return response
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if(set != null)
					set.close();
				//connection.close();
			}
			catch (SQLException e) {}
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
