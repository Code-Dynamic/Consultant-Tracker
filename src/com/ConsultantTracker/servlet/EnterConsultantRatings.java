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
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.persistence.internal.sessions.DirectCollectionChangeRecord.NULL;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Project;
import com.ConsultantTracker.model.Ratings;
import com.ConsultantTracker.model.Ratings_Entry;

/**
 * Servlet implementation class EnterConsultantRatings
 */
public class EnterConsultantRatings extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public EnterConsultantRatings() {
		super();

	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String ratingResults = request.getParameter("ratingResults");	
		int projectID = Integer.parseInt(request.getParameter("projectID"));
		String[] resultsArr = ratingResults.split(",");
		int raterID = Integer.parseInt(request.getParameter("consultantID"));


		int memberRate;
		int memberID;
		String[] memberRateAndID;
		ResultSet rs = null;
		double currentRate = 0;
		int	currentVotes = 0;
		int newNumVotes = 1;
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();

		for(int i = 0; i < resultsArr.length; i++) {


			memberRateAndID = resultsArr[i].split(":");
			memberID = Integer.parseInt(memberRateAndID[0]);
			memberRate = Integer.parseInt(memberRateAndID[1]);				

			Consultant c = em.find(Consultant.class, memberID);
			Project p = em.find(Project.class, projectID);
			Ratings r;
			try {
				r = em.createQuery("SELECT r FROM Ratings r where r.consultant = :cons AND r.project = :proj",Ratings.class)
						.setParameter("cons", c).setParameter("proj", p).getSingleResult();
			}
			catch(NoResultException e) {
				Ratings newRating = new Ratings();
				newRating.setConsultant(c);
				newRating.setProject(p);

				em.getTransaction().begin();
				em.persist(newRating);
				em.getTransaction().commit();

				r = em.createQuery("SELECT r FROM Ratings r where r.consultant = :cons AND r.project = :proj",Ratings.class)
						.setParameter("cons", c).setParameter("proj", p).getSingleResult();
			}
			if(r != null) {
				currentRate = r.getRating();
				currentVotes = r.getNum_Votes();
			}

			newNumVotes += currentVotes;

			r.setNum_Votes(newNumVotes);
			r.setRating(calcNewRate(currentRate,memberRate,newNumVotes));
			em.getTransaction().begin();
			em.persist(r);
			em.getTransaction().commit();
		}

		Ratings_Entry re = new Ratings_Entry();
		Project p = em.find(Project.class, projectID);
		Consultant c =em.find(Consultant.class, raterID);
		re.setConsultant(c);
		re.setProject(p);

		em.getTransaction().begin();
		em.persist(re);
		em.getTransaction().commit();
		
		//possibly update with other error messages
		String responseMsg = "Ratings Entered Succesfully";
		PrintWriter out = response.getWriter();

		response.setContentType("text/plain");
		out.write(responseMsg);	// return response	

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	private double calcNewRate(double currentRate, int rateToAdd, int newNumVotes) {
		// 20 used coz max rating is 5 stars
		double newRateVal = (currentRate * (newNumVotes-1)) + (rateToAdd * 20);
		return (newRateVal/ newNumVotes);
	}

}
