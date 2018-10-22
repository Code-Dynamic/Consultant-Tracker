package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Feedback;
import com.ConsultantTracker.model.Project;
import com.ConsultantTracker.model.Task;

/**
 * Servlet implementation class CreateFeedback
 */
@WebServlet("/CreateFeedback")
public class CreateFeedback extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateFeedback() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String msg = request.getParameter("msg");
		int consultant = Integer.parseInt(request.getParameter("consultant"));
		int project = Integer.parseInt(request.getParameter("project"));
		int task = Integer.parseInt(request.getParameter("task"));
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		Feedback f = new Feedback();
		Project p = em.find(Project.class, project);
		Task t= em.find(Task.class, task);
		Consultant c = em.find(Consultant.class, consultant);
		
		SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd");
		Date dateSent = new Date();
		try {
			dateSent = sdf.parse(LocalDate.now().toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		f.setDate(dateSent);
		f.setMessage(msg);
		f.setConsultant_ID(c);
		f.setProject(p);
		f.setTask_ID(t);
		
		em.getTransaction().begin();
		em.persist(f);
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
