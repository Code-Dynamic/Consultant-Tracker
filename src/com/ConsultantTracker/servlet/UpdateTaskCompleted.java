package com.ConsultantTracker.servlet;

import java.io.IOException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Task;

/**
 * Servlet implementation class UpdateTaskCompleted
 */
@WebServlet("/UpdateTaskCompleted")
public class UpdateTaskCompleted extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UpdateTaskCompleted() {
        super();
    }


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String taskIDString = request.getParameter("TaskID");	
		String isCompleted = request.getParameter("IsComplete");
		
		boolean isTaskCompleted = Boolean.parseBoolean(isCompleted);
		int taskID = Integer.parseInt(taskIDString);
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Task taskToUpdate = em.find(Task.class, taskID);
		
		System.out.println(taskToUpdate.getTask_ID());
		System.out.println(taskToUpdate.isCompleted());
		
		taskToUpdate.setCompleted(isTaskCompleted);
		System.out.println(taskToUpdate.isCompleted());
		em.getTransaction().begin();
		em.persist(taskToUpdate);
		em.getTransaction().commit();
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
