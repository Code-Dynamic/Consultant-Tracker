package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.sql.Date;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CreateFeedback
 */
@WebServlet("/CreateFeedback")
public class CreateFeedback extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateFeedback() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//String date = request.getParameter("date");	//set project Name from request
		String msg = request.getParameter("msg");
		int Consultant = Integer.parseInt(request.getParameter("consultant"));
		int Project = Integer.parseInt(request.getParameter("project"));
		int Task = Integer.parseInt(request.getParameter("task"));

		LocalDate d = LocalDate.now();
		java.sql.Date mydate = java.sql.Date.valueOf(d);
		
		String date = d.toString();
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = con.prepareStatement("INSERT INTO feedback (DATE,MESSAGE,CONSULTANT_CONSULTANT_ID," + 
					"PROJECT_PROJECT_ID,TASK_TASK_ID) VALUES (?,?,?,?,?);");		//create prepared sql statement	
			
			ps.setDate(1, mydate);
			ps.setString(2, msg);
			ps.setInt(3, Consultant);
			ps.setInt(4, Project);
			ps.setInt(5, Task);
			System.out.println(ps.toString());
			ps.executeUpdate();				// execute sql query
			
			ps.close();
		
			ps = con.prepareStatement("select * from feedback");
			rs = ps.executeQuery();				// execute sql query
			if(rs != null){
				String ObjToReturn="";
				while(rs.next()) {				// build return string based on query response
					if(!ObjToReturn.equals(""))
						ObjToReturn +=";";
				 ObjToReturn +=rs.getString("DATE")+','+rs.getString("MESSAGE")+','+rs.getString("CONSULTANT_CONSULTANT_ID") ;
			
				}
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
				if(rs!= null)
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
