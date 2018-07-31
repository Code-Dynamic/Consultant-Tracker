package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assignment;
import com.ConsultantTracker.model.Client;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Project;

/**
 * Servlet implementation class AssignConsultants
 */
@WebServlet("/AssignConsultants")
public class AssignConsultants extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AssignConsultants() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String projectID = (request.getParameter("project"));
		String consultantID = (request.getParameter("consultant"));

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();

		Assignment a = new Assignment();
		Project p = em.find(Project.class, Integer.parseInt(projectID));
		Consultant c = em.find(Consultant.class, Integer.parseInt(consultantID));
		a.setConsultant1(c);
		a.setProject(p);

		em.getTransaction().begin();
		em.persist(a);
		em.getTransaction().commit();
			
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
