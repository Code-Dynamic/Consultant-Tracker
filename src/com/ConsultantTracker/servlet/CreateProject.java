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

//import static java.lang.System.out;
/**
 * Servlet implementation class CreateProject
 * Required Parameters: Name (Project Name), ClientID (Client Identifier),Desc (Project Description)
 * 						Deadl (Project deadline of form yyyy/mm/dd), OnSite (is the project on site)
 * 
 * Successful Return: 
 * 			String of form: Project_Name,Project_Description,Project_Deadline ; Project_Name,Project_Description,Project_Deadline ...
 */
@WebServlet("/CreateProject")
public class CreateProject extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateProject() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String proj_Name = request.getParameter("Name");	//set project Name from request
		String ClientID = request.getParameter("ClientID");
		String Proj_Desc = request.getParameter("Desc");
		String Proj_Deadl = request.getParameter("Deadl");
		String Proj_StartDate = request.getParameter("StartDate");
		int on_Site = Integer.parseInt(request.getParameter("OnSite"));
		
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = con.prepareStatement("INSERT INTO project (PROJECT_NAME,CLIENT_ID,PROJECT_DESCRIPTION," + 
					"PROJECT_DEADLINE,PROJECT_STARTDATE,PROJECT_ONSITE,PROJECT_COMPLETED) VALUES (?,?,?,?,?,?,?);");		//create prepared sql statement	
			
			ps.setString(1, proj_Name);
			ps.setString(2, ClientID);
			ps.setString(3, Proj_Desc);
			ps.setString(4, Proj_Deadl);
			ps.setString(5, Proj_StartDate);
			ps.setInt(6, on_Site);
			ps.setInt(7,0);
			ps.executeUpdate();				// execute sql query
			System.out.println("startDate: "+ Proj_StartDate);
			ps.close();
		
			ps = con.prepareStatement("select * from project");
			rs = ps.executeQuery();				// execute sql query
			if(rs != null){
				String ObjToReturn="";
				while(rs.next()) {				// build return string based on query response
					if(!ObjToReturn.equals(""))
						ObjToReturn +=";";
				 ObjToReturn +=rs.getString("PROJECT_NAME")+','+rs.getString("PROJECT_DESCRIPTION")+','+rs.getString("PROJECT_DEADLINE")+','+rs.getString("PROJECT_STARTDATE");
			
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
