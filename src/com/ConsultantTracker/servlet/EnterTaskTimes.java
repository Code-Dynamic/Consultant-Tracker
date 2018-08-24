package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assigned_Task;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Daily_Times;

/**
 * Servlet implementation class EnterTaskTimes
 */
public class EnterTaskTimes extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EnterTaskTimes() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGets(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String AssignedTaskID = request.getParameter("Assigned_Task_ID");	
		
		double HoursWorked = Double.parseDouble(request.getParameter("Hours_Worked"));


		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Assigned_Task aT = em.find(Assigned_Task.class, Integer.parseInt(AssignedTaskID));
		
		aT.setHours_Worked(HoursWorked);
		em.getTransaction().begin();
		em.persist(aT);
		em.getTransaction().commit();
		
	}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String userTimes = request.getParameter("userTimes");	
		String[] resultsArr = userTimes.split(",");
		int consultantID = Integer.parseInt(request.getParameter("Consultant_ID"));
		long UTC = Long.parseLong(request.getParameter("dayBeginUTC"));

		//returns value for previous month based on current date, not what user has requested
		Date date = new Date();
		
		java.sql.Date sqlDate = new java.sql.Date(UTC);
		java.sql.Date today = new java.sql.Date(date.getTime());	
		
		// this is a string array
		String[] taskTimeAndID;
		ResultSet rs = null;
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		int assignedTaskID;
		double taskTime;
		
		for(int i = 0; i < resultsArr.length; i++) {
			taskTimeAndID = resultsArr[i].split(":");
			assignedTaskID = Integer.parseInt(taskTimeAndID[0]);
			taskTime = Double.parseDouble(taskTimeAndID[1]);				
			Consultant consultantObj = em.find(Consultant.class, consultantID);
			Assigned_Task assignedTaskObj = em.find(Assigned_Task.class, assignedTaskID);;
			TypedQuery<Daily_Times> dtq;
			Daily_Times time = null;
			//test if date equality is based on day or time,might have to do a between statement, with beginning and end of day
			try {
				//last element is always the general time
				if(i != resultsArr.length -1) {
					dtq = em.createQuery("SELECT e FROM Daily_Times e WHERE e.date =:date AND e.assigned_task =:assignedTask",Daily_Times.class)
							.setParameter("date",sqlDate).setParameter("assignedTask", assignedTaskObj);					
				}else { // 
					dtq = em.createQuery("SELECT e FROM Daily_Times e WHERE e.assigned_task IS NULL AND e.date =:date AND e.consultant =:consultant",Daily_Times.class)
							.setParameter("date",sqlDate).setParameter("consultant", consultantObj);					
				}
				time = dtq.getSingleResult();
			}
			catch(NoResultException e) {
				//daily times did not exist, create new entry
				Daily_Times dm = new Daily_Times();
				dm.setDate(sqlDate);
				dm.setConsultant(consultantObj);
				dm.setTime(taskTime);
				dm.setAssigned_task(assignedTaskObj);
				em.getTransaction().begin();
				em.persist(dm);
				em.getTransaction().commit();
				//update assigned task (test if addition works)
				//null if the task type is general task
				if(assignedTaskObj != null) {
					double hoursWorked =  assignedTaskObj.getHours_Worked() + taskTime;
					assignedTaskObj.setHours_Worked(hoursWorked);
					assignedTaskObj.setLast_Update(today);
					em.getTransaction().begin();
					/*atq.executeUpdate();*/
					em.persist(assignedTaskObj);
					em.getTransaction().commit();		
				}
			}
			
			// if daily time already exists:
			if(time != null) {
				//subtract time from assigned task, and add new time,
				//null if the task type is general task
				if(assignedTaskObj != null) {
					assignedTaskObj.subtractHoursWorked(time.getTime());
					assignedTaskObj.addHoursWorked(taskTime);
					assignedTaskObj.setLast_Update(today);
					em.getTransaction().begin();
					em.persist(assignedTaskObj);
					em.getTransaction().commit();
				}
				//then update daily time
				time.setTime(taskTime);
				em.getTransaction().begin();
				em.persist(time);
				em.getTransaction().commit();				
			}
		}
				
	    em.close();
	    emf.close();	
		PrintWriter out = response.getWriter();
		//returns string of format TaskName: TaskTime : TaskID ,
		out.write("Times Entered Succesfully");
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	
		doGet(request, response);
	}

}
