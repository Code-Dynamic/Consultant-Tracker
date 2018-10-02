package com.ConsultantTracker.servlet;

import java.io.IOException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Team;
import com.ConsultantTracker.model.Team_Entity;

/**
 * Servlet implementation class AssignConsultantToTeam
 */
public class AssignConsultantToTeam extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AssignConsultantToTeam() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
				int consultantID = Integer.parseInt(request.getParameter("consultantID"));
				int teamID = Integer.parseInt(request.getParameter("teamID"));

				EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("JPATest");
				EntityManager eManager = entityManagerFactory.createEntityManager();

				Consultant consultant = eManager.find(Consultant.class, consultantID);
				Team team = eManager.find(Team.class, teamID);
				Team_Entity team_Entity = new Team_Entity();
				
				if (team != null) {
					team_Entity.setTeam_ID(team);
					team_Entity.setTeam_Member(consultant);
				}
				else throw new ServletException("Unable to find team"); 
				eManager.getTransaction().begin();
				eManager.persist(team_Entity);
				eManager.getTransaction().commit();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
