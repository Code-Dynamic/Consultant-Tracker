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
 * Servlet implementation class getProjects
 * 
 * returns string in the form 'Project_Name','Project_Description','Client_Name','Project_Deadline,'Project_OnSite'
 */
@WebServlet("/getProjectConsultants")
public class getProjectConsultants extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getProjectConsultants() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
			Connection con = (Connection) getServletContext().getAttribute("DBConnection");
			PreparedStatement ps = null;
			ResultSet rs = null;
			String proj_ID = request.getParameter("projectID");
			try {
				if(proj_ID != null) {
					ps = con.prepareStatement("select * from assignment join consultants on assignment.Consultant_ID=consultants.Consultant_ID where assignment.Project_ID=?");				
					ps.setString(1, proj_ID);
				}
				else
					ps = con.prepareStatement("Select * from Consultants");
					rs = ps.executeQuery();
				if(rs != null){
					
					//User user = new User(rs.getString("name"), rs.getString("email"), rs.getString("country"), rs.getInt("id"));
					//logger.info("User found with details="+user);
					//response.setContentType("application/json");
					String ObjToReturn="";
					while(rs.next()) {
						if(!ObjToReturn.equals(""))
							ObjToReturn +=";";
					 ObjToReturn +=rs.getString("Consultant_ID") +','+rs.getString("Consultant_Name")+','+
							 rs.getString("Consultant_Surname")+','+rs.getString("Consultant_email")+','+
							 rs.getString("Consultant_Cell")+','+rs.getString("Consultant_Admin");
					 if(proj_ID != null)
						 ObjToReturn +=','+rs.getString("Assignment_ID");
				
					}
					//PrintWriter out = response.getWriter();
					//out.wr(ObjToReturn);
					response.setContentType("text/plain");
					response.getWriter().write(ObjToReturn);
				}else{
					RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
					PrintWriter out= response.getWriter();
					//logger.error("User not found with email="+email);
					out.println("<font color=red>No user found with given email id, please register first.</font>");
					rd.include(request, response);
				}
			} catch (SQLException e) {
				e.printStackTrace();
				//logger.error("Database connection problem");
				 response.getWriter().println("Connection Failed");
				throw new ServletException("DB Connection problem.");
			}finally{
				try {
					if(rs != null)
						rs.close();
					if(ps != null)
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
