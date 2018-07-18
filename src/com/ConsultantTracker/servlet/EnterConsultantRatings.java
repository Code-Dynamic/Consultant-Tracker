package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class EnterConsultantRatings
 */
public class EnterConsultantRatings extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EnterConsultantRatings() {
        super();
        // TODO Auto-generated constructor stub	
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String ratingResults = request.getParameter("ratingResults");	//set project Name from request
		int projectID = Integer.parseInt(request.getParameter("projectID"));
		String[] resultsArr = ratingResults.split(",");
		int raterID = Integer.parseInt(request.getParameter("consultantID"));
		//System.out.println(resultsArr[1]);
		
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		
		int memberRate;
		int memberID;
		String[] memberRateAndID;
		ResultSet rs = null;
		double currentRate = 0;
		int	currentVotes = 0;
		int newNumVotes = 1;
		for(int i = 0; i < resultsArr.length; i++) {
			
			try {
				memberRateAndID = resultsArr[i].split(":");
				memberID = Integer.parseInt(memberRateAndID[0]);
				memberRate = Integer.parseInt(memberRateAndID[1]);				
				
				ps = con.prepareStatement("SELECT * FROM ratings WHERE CONSULTANT_CONSULTANT_ID = ? AND PROJECT_PROJECT_ID = ?");
				ps.setInt(1, memberID);
				ps.setInt(2, projectID);				
				rs = ps.executeQuery();				
				if(rs != null){
					if(rs.next()) {
					currentRate = rs.getDouble("Rating");
					currentVotes = rs.getInt("Num_Votes");
					}
				}	
				ps.close();
				newNumVotes += currentVotes;
				ps = con.prepareStatement("UPDATE ratings SET NUM_VOTES = ?, RATING = ? WHERE CONSULTANT_CONSULTANT_ID = ? AND PROJECT_PROJECT_ID = ?");
				//System.out.println(newNumVotes);
				ps.setInt(1, newNumVotes);
				ps.setDouble(2, calcNewRate(currentRate,memberRate,newNumVotes));
				ps.setInt(3, memberID);
				ps.setInt(4, projectID);	
				ps.executeUpdate();	
				ps.close();
					
/*				
				ps = con.prepareStatement("UPDATE ratings SET RATING = ? WHERE CONSULTANT_CONSULTANT_ID = ? AND PROJECT_PROJECT_ID = ?");
				ps.setDouble(1, calcNewRate(currentRate,memberRate,newNumVotes));
				ps.setInt(2, memberID);
				ps.setInt(3, projectID);	
				ps.executeUpdate();	
				ps.close();			*/	
				
			} catch (SQLException e) {
				e.printStackTrace();
				//logger.error("Database connection problem");d
				throw new ServletException("DB Connection problem.");
			}finally{
/*				try {
					ps.close();
				} catch (SQLException e) {
					//logger.error("SQLException in closing PreparedStatement or ResultSet");;
				}*/
			}			
		}
		
		try {
			ps = con.prepareStatement("INSERT INTO ratings_entry (CONSULTANT_CONSULTANT_ID,PROJECT_PROJECT_ID) VALUES (?,?);");
			ps.setInt(1, raterID);
			ps.setInt(2, projectID);	
			ps.executeUpdate();				
		} catch (SQLException e) {
			e.printStackTrace();
			//logger.error("Database connection problem");d
			throw new ServletException("DB Connection problem.");
		}finally{
			try {
				ps.close();
				PrintWriter out = response.getWriter();
				response.setContentType("text/plain");
				out.write("Ratings submitted, Thank you.");				
				
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
	
	private double calcNewRate(double currentRate, int rateToAdd, int newNumVotes) {
		// 20 used coz max rating is 5 stars
		double newRateVal = (currentRate * (newNumVotes-1)) + (rateToAdd * 20);
		return (newRateVal/ newNumVotes);
	}

}
