package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TemporalType;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Daily_Times;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.text.DecimalFormat;
import java.text.ParseException;


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
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
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

		//returns value for previous month based on current date, not what user has requested
		Date date = new Date();
		LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		int currentMonth = localDate.getMonthValue();	
		int currentYear = localDate.getYear();
		
		Boolean prevMonth = false;
		String returnObj = getUtilizationFromDB(date1, date2, month, prevMonth,Consultant_ID);
		GregorianCalendar prevMonthBegin;
		GregorianCalendar prevMonthEnd;
		if(currentMonth == 1) {
			//System.out.println("all selected");
			prevMonthBegin = new GregorianCalendar(currentYear -1, 11, firstDayOfMonth,0,0);
			prevMonthEnd = new GregorianCalendar(currentYear -1, 12, firstDayOfMonth,0,0);
		}
		else {
			prevMonthBegin = new GregorianCalendar(currentYear, currentMonth - 2, firstDayOfMonth,0,0);
			prevMonthEnd = new GregorianCalendar(currentYear, currentMonth - 1, firstDayOfMonth,0,0);
		}		
		prevMonth =  true;
		returnObj += getUtilizationFromDB(prevMonthBegin,prevMonthEnd,currentMonth - 1, prevMonth, Consultant_ID);
		//COMPLETE rating system and utilization. Do fancy pie charts
		PrintWriter out = response.getWriter();
		
		response.setContentType("text/plain");
		out.write(returnObj);	// return response		

	}
	
	//assumes that consultants don't work on Saturdays
	private String getUtilizationFromDB(GregorianCalendar startDate, GregorianCalendar endDate ,int month, Boolean prevMonth, String Consultant_ID) throws ServletException, IOException{
		java.sql.Date sqlDate1 = new java.sql.Date(startDate.getTimeInMillis());
		java.sql.Date sqlDate2 = new java.sql.Date(endDate.getTimeInMillis());		
		
//		Connection con = (Connection) getServletContext().getAttribute("DBConnection"); //establish database connection
//		PreparedStatement ps = null;
//		ResultSet rs = null;
		
//		try {
//				ps = con.prepareStatement(" SELECT * FROM daily_times WHERE CONSULTANT_CONSULTANT_ID = ? AND DATE BETWEEN ? AND ?");				
//				ps.setString(1, Consultant_ID);
//				ps.setDate(2, sqlDate1);
//				ps.setDate(3, sqlDate2);
//				rs = ps.executeQuery();
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
	
		Consultant c = em.find(Consultant.class, Integer.parseInt(Consultant_ID));
		java.util.List<Daily_Times> times = em.createQuery("SELECT d FROM Daily_Times d WHERE d.consultant = :consultant AND d.date BETWEEN :startDate AND :endDate",Daily_Times.class)
                .setParameter("consultant", c).setParameter("startDate", sqlDate1).setParameter("endDate", sqlDate2).getResultList();
//		System.out.println("Times size: "+ times.size());
				int workingDaysWithHols = getWorkingDaysInMonth(startDate.getTimeInMillis(),endDate.getTimeInMillis());
				int workingDays = removeHolidays(month, workingDaysWithHols);
				  //System.out.println("workDays: "+ workingDays);
				int hoursPerDay = 8;
				double expectedHours = hoursPerDay * workingDays;				
			if(times != null){
				//User user = new User(rs.getString("name"), rs.getString("email"), rs.getString("country"), rs.getInt("id"));
				//logger.info("User found with details="+user);
				//response.setContentType("application/json");
				Double generalTime = 0.0;
				Double assignedTaskTime = 0.0;
				int numResults = 0;
				for(int i =0;i<times.size();i++) {
					Daily_Times d = times.get(i);
//					generalTime += Double.parseDouble(rs.getString("GENERAL_TIME"));
//					assignedTaskTime += Double.parseDouble(rs.getString("TOTAL_ASSIGNED_TASKS_TIME"));
					generalTime += d.getGeneral_Time();
					assignedTaskTime += d.getTotal_Assigned_Tasks_Time();
					numResults++;
				}
				//System.out.println("numResults: "+numResults);
				double unnaccountedHours = expectedHours - generalTime - assignedTaskTime;
				if(prevMonth) {
					Double utilizationPerc = (assignedTaskTime/(expectedHours)) * 100;
			        String numberAsString; 
			        if(assignedTaskTime == 0.0) {
			        	numberAsString = "0";
			        }else {
				        DecimalFormat decimalFormat = new DecimalFormat("#.00");
			        	numberAsString = decimalFormat.format(utilizationPerc);
			        }
			        return ","+numberAsString;
				}else {
					String valuesStr = Double.toString(assignedTaskTime) + "," + Double.toString(generalTime) + "," + Double.toString(unnaccountedHours);
					return valuesStr;					
				}
			}else{
				if(prevMonth) {
					return "0";
				}else {
					String valuesStr = Double.toString(0.0) + "," + Double.toString(0.0) + "," + Double.toString(expectedHours);
					return valuesStr;					
				}
			}
//		} catch (SQLException e) {
//			e.printStackTrace();
//			throw new ServletException("DB Connection problem.");
//		}finally{
//			try {
//				if(rs != null)
//					rs.close();
//				if(ps != null)
//					ps.close();
//			} catch (SQLException e) {
//				//logger.error("SQLException in closing PreparedStatement or ResultSet");;
//			}
//		}
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
	
}
