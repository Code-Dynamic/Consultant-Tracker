package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assigned_Task;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Daily_Times;

/**
 * Servlet implementation class CheckDailyTimesEntered
 */
public class GetTimesAndTasks extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetTimesAndTasks() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		int consultant_ID = Integer.parseInt(request.getParameter("Consultant_ID"));
		boolean taskStatus = false;
		java.sql.Date sqlDate = new java.sql.Date(Long.parseLong(request.getParameter("UTC")));
		
		Consultant c = em.find(Consultant.class, consultant_ID);
		List<Daily_Times> dailyTimes = em.createQuery("SELECT d FROM Daily_Times d WHERE d.consultant = :cons AND d.date = :date",Daily_Times.class)
                .setParameter("cons", c).setParameter("date", sqlDate).getResultList();

		List<Assigned_Task> assignedTasks = em.createQuery("SELECT at FROM Assigned_Task at WHERE at.consultant =:cons AND at.date_Assigned <= :dateAssigned AND (at.task_Completed = :taskStatus OR at.date_Completed >=:dateCompleted)",Assigned_Task.class)
                .setParameter("cons", c).setParameter("dateAssigned", sqlDate).setParameter("taskStatus", taskStatus).setParameter("dateCompleted", sqlDate).getResultList();
		String resultsStr = "";
		Assigned_Task at;
		for(int i = 0 ; i < assignedTasks.size(); i++) {
			if(resultsStr.length() > 0) {
				resultsStr += ",";
			}
			at = assignedTasks.get(i);
			resultsStr +=  at.getTask().getName() +":" + checkDailyTimePresent(at.getAssigned_Task_ID(), dailyTimes) + ":"+ at.getAssigned_Task_ID();
		}

		if(dailyTimes.size() > 0 ) {
				if(resultsStr.length() > 0) {
					resultsStr += ",";
				}
				resultsStr +=  "General:" + getGeneralTime(dailyTimes) + ":-1";
			}
		else {
				if(resultsStr.length() > 0) {
					 resultsStr += ",";
					}
				resultsStr +=  "General:0.0: -1";
			}
		
		PrintWriter out = response.getWriter();
		out.write(resultsStr);
				
	}
	
	protected double checkDailyTimePresent(int assignedTaskID, List<Daily_Times> dailyTimes) {
		double time = 0.0;
		for(int i = 0; i < dailyTimes.size(); i++) {
			//if assigned task isn't null--> null for general
			if(dailyTimes.get(i).getAssigned_task() != null) {
				if(assignedTaskID == dailyTimes.get(i).getAssigned_task().getAssigned_Task_ID()) {
					time = dailyTimes.get(i).getTime();
				}	
			}

		} 
		return time;
	}
	
	protected double getGeneralTime(List<Daily_Times> dailyTimes) {
		double time = 0.0;
		for(int i = 0; i < dailyTimes.size(); i++) {
			if(dailyTimes.get(i).getAssigned_task() == null) {
				time = dailyTimes.get(i).getTime();
			}
		} 
		return time;
	}	
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
