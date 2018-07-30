package com.ConsultantTracker.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Daily_Times;

import java.util.Date;

/**
 * Servlet implementation class EnterDailyTimes
 */
public class EnterDailyTimes extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public EnterDailyTimes() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		SimpleDateFormat sdf =new SimpleDateFormat("yyyy-mm-dd");
		Date date = new Date();

		try {
			date = sdf.parse(LocalDate.now().toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}


		String Consultant_ID = request.getParameter("Consultant_ID");	//set project Name from request

		double general = Double.parseDouble(request.getParameter("general"));
		double totalTasks = Double.parseDouble(request.getParameter("totalTasks"));

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();

		Daily_Times dm = new Daily_Times();
		Consultant c= em.find(Consultant.class, Integer.parseInt(Consultant_ID));

		dm.setDate(date);
		dm.setConsultant(c);
		dm.setGeneral_Time(general);
		dm.setTotal_Assigned_Tasks_Time(totalTasks);

		em.getTransaction().begin();
		em.persist(dm);
		em.getTransaction().commit();

		PrintWriter out = response.getWriter();

		response.setContentType("text/plain");
		out.write("Times entered successfully");

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
