package com.ConsultantTracker.servlet;

import java.io.IOException;
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
 * Servlet implementation class removeTask
 */
@WebServlet("/removeAssignedTask")
public class removeAssignedTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public removeAssignedTask() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String taskID = request.getParameter("taskID");
		Connection connection = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement statement = null;
		PreparedStatement deleteStatement = null;
		ResultSet set = null;
		try {
			
			//search for consultant in the assignments table 
			statement = connection.prepareStatement("SELECT * FROM assigned_task WHERE task_task_ID = ?");
			statement.setString(1, taskID);
			set = statement.executeQuery();
			while(set.next())
			{
				deleteStatement = connection.prepareStatement("DELETE FROM assigned_task WHERE task_task_ID = ?");
				deleteStatement.setString(1, set.getString("task_task_ID"));
				deleteStatement.executeUpdate();
				deleteStatement.close();
			}
			
			deleteStatement = connection.prepareStatement("DELETE FROM task WHERE task_ID =?");
			deleteStatement.setString(1, taskID);
			deleteStatement.executeUpdate();
			deleteStatement.close();
			statement.close();
			response.setContentType("text/plain");
			response.getWriter().write("Done");	// return response
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
