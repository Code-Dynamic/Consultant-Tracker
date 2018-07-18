package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;


/**
 * Servlet implementation class getConsultantUtilization
 */
public class getConsultantUtilization extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getConsultantUtilization() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String Consultant_ID = request.getParameter("Consultant_ID");	//set project Name from request
		String strMonth = request.getParameter("month");
		//System.out.println(strMonth);
		int month = getMonthInt(strMonth);
		int year = Integer.parseInt(request.getParameter("year"));
		int firstDayOfMonth = 1;
		
		//all year
		GregorianCalendar date1;
		GregorianCalendar date2;
		if(month == 12) {
			//System.out.println("all selected");
			 date1 = new GregorianCalendar(year, 0, firstDayOfMonth,0,0);
			 date2 = new GregorianCalendar(year + 1, 0, firstDayOfMonth,0,0);
		}
		else {
			date1 = new GregorianCalendar(year, month, firstDayOfMonth,0,0);
			date2 = new GregorianCalendar(year, month +1, firstDayOfMonth,0,0);
			//System.out.println("d1: "+format(date1));
			//System.out.println("d2: "+format(date2));
		}
		java.sql.Date sqlDate1 = new java.sql.Date(date1.getTimeInMillis());
		java.sql.Date sqlDate2 = new java.sql.Date(date2.getTimeInMillis());
		//build 2 dates, beginning of month and end. Query between extremes.
		//COMPLETE rating system and utilization. Do fancy pie charts
		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
				ps = con.prepareStatement(" SELECT * FROM daily_times WHERE CONSULTANT_CONSULTANT_ID = ? AND DATE BETWEEN ? AND ?");				
				ps.setString(1, Consultant_ID);
				ps.setDate(2, sqlDate1);
				ps.setDate(3, sqlDate2);
				rs = ps.executeQuery();
				int workingDaysWithHols = getWorkingDaysInMonth(date1.getTimeInMillis(),date2.getTimeInMillis());
				int workingDays = removeHolidays(month, workingDaysWithHols);
				  //System.out.println("workDays: "+ workingDays);
				int hoursPerDay = 8;
				double expectedHours = hoursPerDay * workingDays;				
			if(rs != null){
				//User user = new User(rs.getString("name"), rs.getString("email"), rs.getString("country"), rs.getInt("id"));
				//logger.info("User found with details="+user);
				//response.setContentType("application/json");
				Double generalTime = 0.0;
				Double assignedTaskTime = 0.0;
				int numResults = 0;
				while(rs.next()) {
					generalTime += Double.parseDouble(rs.getString("GENERAL_TIME"));
					assignedTaskTime += Double.parseDouble(rs.getString("TOTAL_ASSIGNED_TASKS_TIME"));
					numResults++;
				}
				//System.out.println("numResults: "+numResults);
				double unnaccountedHours = expectedHours - generalTime - assignedTaskTime;
				String returnObj = Double.toString(assignedTaskTime) + "," + Double.toString(generalTime) + "," + Double.toString(unnaccountedHours);
				response.setContentType("text/plain");
				response.getWriter().write(returnObj);
			}else{
				String returnObj = Double.toString(0.0) + "," + Double.toString(0.0) + "," + Double.toString(expectedHours);
				response.setContentType("text/plain");
				response.getWriter().write(returnObj);				
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
		
	//assumes that consultants don't work on Saturdays
	private int getWorkingDaysInMonth(long startDate, long endDate){
		  Calendar startCal = Calendar.getInstance();
		  startCal.setTimeInMillis(startDate);

		  Calendar endCal = Calendar.getInstance();
		  endCal.setTimeInMillis(endDate);

		  int workDays = 0;

		  while (startCal.getTimeInMillis() < endCal.getTimeInMillis()) {
			    if (startCal.get(Calendar.DAY_OF_WEEK) != Calendar.SATURDAY && startCal.get(Calendar.DAY_OF_WEEK) != Calendar.SUNDAY)
			    {
			      workDays++;
			    }
			    startCal.add(Calendar.DAY_OF_MONTH, 1);
		  }
		  
		  return workDays;
	}
	
	private int getMonthInt(String month){
	     int monthNum;
	     switch (month) {
	         case "January":
	             monthNum = 0;
	             break;
	         case "February":
	             monthNum = 1;
	             break;
	         case "March":
	             monthNum = 2;
	             break;
	         case "April":
	             monthNum = 3;
	             break;
	         case "May":
	             monthNum = 4;
	             break;
	         case "June":
	             monthNum = 5;
	             break;
	         case "July":
	             monthNum = 6;
	             break;
	         case "August":
	             monthNum = 7;
	             break;
	         case "September":
	             monthNum = 8;
	             break;
	         case "October":
	             monthNum = 9;
	             break;
	         case "November":
	             monthNum = 10;
	             break;
	         case "December":
	             monthNum = 11;
	             break;
	         default:
	             monthNum = 12;
	     }
	     return monthNum;
	}	
	
	private int removeHolidays(int month, int workingDaysWithHols){
		//holidays per month in SA
		int[] holsArr = {1,0,1,3,1,1,0,1,1,0,0,3,12};
		return workingDaysWithHols - holsArr[month];
		
	}		
	
/*	private String format(GregorianCalendar calendar){
	    SimpleDateFormat fmt = new SimpleDateFormat("dd-MMM-yyyy");
	    fmt.setCalendar(calendar);
	    String dateFormatted = fmt.format(calendar.getTime());
	    return dateFormatted;
	}	*/
	
}
