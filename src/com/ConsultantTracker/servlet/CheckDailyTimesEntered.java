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
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Daily_Times;
import com.ConsultantTracker.model.Ratings;
import com.sun.xml.internal.bind.v2.schemagen.xmlschema.List;

/**
 * Servlet implementation class CheckDailyTimesEntered
 */
public class CheckDailyTimesEntered extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CheckDailyTimesEntered() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd");
		Date dateSent = new Date();
		try {
			dateSent = sdf.parse(LocalDate.now().toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		int consultant_ID = Integer.parseInt(request.getParameter("Consultant_ID"));
		
		Consultant c = em.find(Consultant.class, consultant_ID);
		java.util.List<Daily_Times> NumOfTimes = em.createQuery("SELECT d FROM Daily_Times d WHERE d.consultant = :cons AND d.date = :date",Daily_Times.class)
                .setParameter("cons", c).setParameter("date", dateSent).getResultList();
		
		PrintWriter out = response.getWriter();
		if(NumOfTimes.size() >=1)
			out.write("1");
		else
			out.write("0");
				

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
