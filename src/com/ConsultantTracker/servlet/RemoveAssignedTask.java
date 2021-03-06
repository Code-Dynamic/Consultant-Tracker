package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assigned_Task;
import com.ConsultantTracker.model.Daily_Times;
import com.ConsultantTracker.model.Task;
import com.mysql.jdbc.Connection;

/**
 * Servlet implementation class removeTask
 */
@WebServlet("/RemoveAssignedTask")
public class RemoveAssignedTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RemoveAssignedTask() {
        super();
        
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String taskID = request.getParameter("taskID");
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Task t =em.find(Task.class, Integer.parseInt(taskID));
		java.util.List<Assigned_Task> listOfAssignedTasks = em.createQuery("SELECT * FROM assigned_task WHERE task_task_ID = ?",Assigned_Task.class)
                .setParameter(1, t).getResultList();
		
		for(int i=0;i<listOfAssignedTasks.size();i++) {
			Assigned_Task a = listOfAssignedTasks.get(i);
			em.getTransaction().begin();
			em.remove(a);
			em.getTransaction().commit();
		}
		t = em.find(Task.class,Integer.parseInt(taskID));
		em.getTransaction().begin();
		em.remove(t);
		em.getTransaction().commit();
			

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
