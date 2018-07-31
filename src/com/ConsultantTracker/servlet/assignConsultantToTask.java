package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.util.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.print.DocFlavor.STRING;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assigned_Task;
import com.ConsultantTracker.model.Client;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Task;

/**
 * Servlet implementation class assignConsultantToTask
 */
@WebServlet("/assignConsultantToTask")
public class assignConsultantToTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public assignConsultantToTask() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int taskID= Integer.parseInt(request.getParameter("taskID"));
		int assignedHours = Integer.parseInt(request.getParameter("assignedHours"));
		int hoursWorked = Integer.parseInt(request.getParameter("hoursWorked"));
		int consultantID = Integer.parseInt(request.getParameter("consultantID"));
		String dateAssigned = request.getParameter("dateAssigned");
		String dueDate = request.getParameter("dueDate");

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();

		Consultant c = em.find(Consultant.class, consultantID);
		Task t = em.find(Task.class, taskID);
		
		Assigned_Task a= new Assigned_Task();
		
		SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd");
		Date DateAssigned = new Date();
		Date DueDate = new Date();
		Date lastUpdate = new Date();
		try {
			DateAssigned = sdf.parse(dateAssigned);
			DueDate =sdf.parse(dueDate);
			lastUpdate = sdf.parse(LocalDate.now().toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		a.setDate_Assigned(DateAssigned);
		a.setDue_Date(DueDate);
		a.setAssigned_Hours(assignedHours);
		a.setHours_Worked(hoursWorked);
		a.setLast_Update(lastUpdate);
		a.setConsultant(c);
		a.setTask(t);
		em.getTransaction().begin();
		em.persist(a);
		em.getTransaction().commit();

		String ObjToReturn = "Assigned task succesfully!" ;
		response.setContentType("text/plain");
		response.getWriter().write(ObjToReturn);
			
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
