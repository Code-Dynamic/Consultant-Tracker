package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.Persistence;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Assignment;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Daily_Times;
import com.ConsultantTracker.model.Project;
import com.ConsultantTracker.model.Ratings;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class UnassignConsultant
 */
@WebServlet("/UnassignConsultant")
public class UnassignConsultant extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UnassignConsultant() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int assignmentID = Integer.parseInt(request.getParameter("assignment"));
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Assignment a =  em.find(Assignment.class, assignmentID);
		Project project = a.getProject();
		Consultant consultant = a.getConsultant();

		Ratings rateEntry = null; 
		try {
		 rateEntry = em.createQuery("SELECT d FROM Ratings d WHERE d.consultant =:consultant AND d.project =:project ",Ratings.class)
				.setParameter("consultant", consultant).setParameter("project", project).getSingleResult();
		}
		catch(NoResultException e) {
			
		}
		em.getTransaction().begin();
		em.remove(a);
		if(rateEntry != null)
			em.remove(rateEntry);
		em.getTransaction().commit();

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
