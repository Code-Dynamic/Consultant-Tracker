package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CheckDailyTimesEntered
 */
public class CheckDailyTimesEntered extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CheckDailyTimesEntered() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Date javaDate = new Date();
		java.sql.Date today = new java.sql.Date(javaDate.getTime());
		
		int consultant_ID = Integer.parseInt(request.getParameter("Consultant_ID"));
		
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		ResultSet rs = null;
			try {			
				PrintWriter out = response.getWriter();
				response.setContentType("text/plain");
				
				ps = con.prepareStatement("SELECT COUNT(*) as count FROM daily_times WHERE CONSULTANT_CONSULTANT_ID = ? AND DATE = ?");
				ps.setInt(1, consultant_ID);
				ps.setDate(2, today);				
				rs = ps.executeQuery();				
				if(rs != null){
					if(rs.next()) {
					    int count = rs.getInt("count");
					    if (count >= 1) {
					    	out.write("1");
					    } else {
					    	out.write("0");
					    }
					}
				}
				
			} catch (SQLException e) {
				e.printStackTrace();
				//logger.error("Database connection problem");d
				throw new ServletException("DB Connection problem.");
			}finally{
				try {
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
