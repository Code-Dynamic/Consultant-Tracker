package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
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
import com.ConsultantTracker.model.Assignment;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Task;
import com.mysql.jdbc.Connection;

/**
 * Servlet implementation class RemoveConsultant
 */
@WebServlet("/RemoveConsultant")
public class RemoveConsultant extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RemoveConsultant() {
        super();
        
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String consultant = request.getParameter("consultant");
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Consultant c = em.find(Consultant.class, Integer.parseInt(consultant));
		java.util.List<Assignment> listOfAssignedTasks = em.createQuery("SELECT * FROM assignment WHERE CONSULTANT_CONSULTANT_ID = ?",Assignment.class)
                .setParameter(1, c).getResultList();
		
		for(int i=0;i<listOfAssignedTasks.size();i++) {
			Assignment a = listOfAssignedTasks.get(i);
			em.getTransaction().begin();
			em.remove(a);
			em.getTransaction().commit();
		}
	
		c = em.find(Consultant.class, Integer.parseInt(consultant));
		em.getTransaction().begin();
		em.remove(c);
		em.getTransaction().commit();

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
