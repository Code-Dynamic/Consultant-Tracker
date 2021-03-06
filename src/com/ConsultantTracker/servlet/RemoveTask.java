package com.ConsultantTracker.servlet;

import java.io.IOException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assigned_Task;
import com.ConsultantTracker.model.Assignment;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Task;

/**
 * Servlet implementation class RemoveTask
 */
public class RemoveTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RemoveTask() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int taskID = Integer.parseInt(request.getParameter("task"));	//set project ID from request
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Task task= em.find(Task.class, taskID);
		java.util.List<Assigned_Task> listOfAssignedTasks = em.createQuery("SELECT a FROM Assigned_Task a WHERE a.task = :taskId",Assigned_Task.class)
                .setParameter("taskId", task).getResultList();
		
		for(int i=0;i<listOfAssignedTasks.size();i++) {
			Assigned_Task assignedTask = listOfAssignedTasks.get(i);
			em.getTransaction().begin();
			em.remove(assignedTask);
			em.getTransaction().commit();
		}
		
		
		em.getTransaction().begin();
		em.remove(task);
		em.getTransaction().commit();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
