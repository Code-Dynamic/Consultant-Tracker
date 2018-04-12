package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mysql.jdbc.Connection;

/**
 * Servlet implementation class RemoveConsultant
 */
@WebServlet("/RemoveConsultant")
public class RemoveConsultant extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RemoveConsultant() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String consultant = request.getParameter("consultant");
		Connection connection = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement statement = null;
		PreparedStatement deleteStatement = null;
		ResultSet set = null;
		try {
			
			//search for consultant in the assignments table 
			statement = connection.prepareStatement("SELECT * FROM assignment WHERE Consultant_ID = ?");
			statement.setString(1, consultant);
			set = statement.executeQuery();
			while(set.next())
			{
				deleteStatement = connection.prepareStatement("DELETE FROM assignment WHERE Assignment_ID = ?");
				deleteStatement.setString(1, set.getString("Assignment_ID"));
				deleteStatement.executeUpdate();
				deleteStatement.close();
			}
			
			deleteStatement = connection.prepareStatement("DELETE FROM consultants WHERE Consultant_ID =?");
			deleteStatement.setString(1, consultant);
			deleteStatement.executeUpdate();
			deleteStatement.close();
			statement.close();
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				if (set !=null)
					set.close();
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
