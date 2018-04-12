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
 * Servlet implementation class DeleteProject
 */
@WebServlet("/DeleteProject")
public class DeleteProject extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DeleteProject() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String proj_ID = request.getParameter("projectID");	//set project ID from request
		
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = con.prepareStatement("UPDATE projects SET Project_Deleted='1' WHERE Project_ID=?;");		//create prepared sql statement	
			ps.setString(1, proj_ID);
			ps.executeUpdate();				// execute sql query
			ps.close();
			
			ps = con.prepareStatement("select * from projects where project_ID=?");
			ps.setString(1, proj_ID);
			rs = ps.executeQuery();				// execute sql query
			if(rs != null){
				String ObjToReturn="";
				while(rs.next()) {				// build return string based on query response
					if(!ObjToReturn.equals(""))
						ObjToReturn +=";";
				 ObjToReturn +=rs.getString("Project_Name")+','+rs.getString("Project_Description")+','+rs.getString("Project_Deleted") ;
			
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
				rs.close();
				ps.close();
			} catch (SQLException e) {
				//logger.error("SQLException in closing PreparedStatement or ResultSet");;
			}
		//response.getWriter().append("Served at: Delete Project");
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
