package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

//import org.apache.log4j.Logger;

@WebServlet("/createConsultant" )
public class createConsultant extends HttpServlet {
	private static final long serialVersionUID = 1L;

	//static Logger logger = Logger.getLogger(LoginServlet.class);
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Entereed create consultant servlet");
		String name = request.getParameter("name");
		String surname = request.getParameter("surname");
		String email = request.getParameter("email");
		String cell = request.getParameter("cell");
		String adminStr = request.getParameter("admin");
		Boolean admin = false;
		if(adminStr.equals("1")) {
			admin = true;
		}
//		error handling done at front-end......confirm
//		String errorMsg = null;
//		if(email == null || email.equals("")){
//			errorMsg ="User Email can't be null or empty";
//		}
//		
//		if(errorMsg != null){
//			RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
//			PrintWriter out= response.getWriter();
//			out.println("<font color=red>"+errorMsg+"</font>");
//			rd.include(request, response);
//		}else{
		Connection con = (Connection) getServletContext().getAttribute("DBConnection");
		PreparedStatement ps = null;
		try {
			
			ps = con.prepareStatement("INSERT INTO consultants (Consultant_Name,Consultant_Surname, Consultant_email,Consultant_Cell,Consultant_Admin) VALUES (?, ?, ?, ?, ?)");
			ps.setString(1, name);
			ps.setString(2, surname);
			ps.setString(3, email);
			ps.setString(4, cell);
			ps.setBoolean(5, admin);
			ps.executeUpdate();
			//**sends success message back if user is stored successfully 
			String ObjToReturn = "User created succesfully!" ;
			response.setContentType("text/plain");
			response.getWriter().write(ObjToReturn);

		} catch (SQLException e) {
			e.printStackTrace();
			//logger.error("Database connection problem");
			throw new ServletException("DB Connection problem.");
		}finally{
			try {
				ps.close();
			} catch (SQLException e) {
				//logger.error("SQLException in closing PreparedStatement or ResultSet");;
			}
			
		}
	
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}	
	

}