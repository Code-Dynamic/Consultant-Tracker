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
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class UnassignConsultant
 */
@WebServlet("/UnassignConsultant")
public class UnassignConsultant extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UnassignConsultant() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		int assignmentID = Integer.parseInt(request.getParameter("assignment"));
		Connection connection = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement statement = null;
		ResultSet set = null;
		
		try {
		
			statement = connection.prepareStatement("DELETE FROM assignment WHERE Assignment_ID = ?");
			statement.setInt(1, assignmentID);
			statement.executeUpdate();	// execute sql query
			statement.close();
			//see if it was inserted into the database
			
				PrintWriter out = response.getWriter();
				response.setContentType("text/plain");
				out.write("Unassign Done");	// return response

			
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
