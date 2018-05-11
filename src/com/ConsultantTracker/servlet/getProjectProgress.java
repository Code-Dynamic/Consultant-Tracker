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
 * Servlet implementation class getProjectProgress
 */
@WebServlet("/getProjectProgress")
public class getProjectProgress extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getProjectProgress() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String proj_Name = request.getParameter("Project_Id");	//set project Name from request

		int i = Integer.parseInt(proj_Name);
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = con.prepareStatement("select * from project p join task t on p.PROJECT_ID=t.PROJECT_PROJECT_ID join assigned_task a on a.TASK_TASK_ID=t.TASK_ID where p.PROJECT_ID=?");		//create prepared sql statement	
			
			ps.setInt(1, i);
			System.out.println(ps.toString());
			rs = ps.executeQuery();				// execute sql query
			// execute sql query
			Double TotalAssigned=0.0,TotalDone =0.0;
			if(rs != null){
				String ObjToReturn="";
				while(rs.next()) {				// build return string based on query response
					if(!ObjToReturn.equals(""))
						ObjToReturn +=";";
					TotalAssigned +=Double.parseDouble(rs.getString("ASSIGNED_HOURS"));
					TotalDone += Double.parseDouble(rs.getString("HOURS_WORKED"));
			
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
				//logger.error("User not found with email="+email);
				out.write("SQL Query Failed for DeleteProject.");
				rd.include(request, response);
			}
		} catch (SQLException e) {
			e.printStackTrace();
			//logger.error("Database connection problem");
			throw new ServletException("DB Connection problem.");
		}finally{
			try {
				if(rs != null)
				rs.close();
				if(ps!=null)
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
