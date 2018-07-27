package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Project;
import com.ConsultantTracker.model.Task;

/**
 * Servlet implementation class createTask
 */
@WebServlet("/createTask")
public class createTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public createTask() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String description= request.getParameter("description");
		String dueDate = request.getParameter("dueDate");
		String name = request.getParameter("name");
		System.out.println(request.getParameter("projectID"));
		int projectID = Integer.parseInt(request.getParameter("projectID"));
	
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Task t = new Task();
		Project p = em.find(Project.class, projectID);
		
		t.setDescription(description);
		t.setName(name);
		
		SimpleDateFormat sdf =new SimpleDateFormat("yyyy-mm-dd");
		Date dDate = new Date();
		try {
			dDate = sdf.parse(dueDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		t.setDue_Date(dDate);
		t.setProject(p);
		
		em.getTransaction().begin();
		em.persist(t);
		em.getTransaction().commit();
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
