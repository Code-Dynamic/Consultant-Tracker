package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Team;

/**
 * Servlet implementation class CreateTeam
 */
public class CreateTeam extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateTeam() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stubString 
		String consultantID = request.getParameter("leaderID");

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Team newTeam = new Team();
		Consultant consultant = em.find(Consultant.class, Integer.parseInt(consultantID));
		if (consultant != null)
			newTeam.setTeam_Leader(consultant);
		else
			throw new ServletException("Couldn't find the consultant ID");
		
		em.getTransaction().begin();
		em.persist(newTeam);
		em.getTransaction().commit();
		
		PrintWriter out = response.getWriter();
		out.write(String.valueOf(newTeam.getTeam_ID()));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
