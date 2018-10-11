package com.ConsultantTracker.servlet;

import java.io.IOException;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ConsultantTracker.model.Client;

/**
 * Servlet implementation class AddClient
 */
public class AddClient extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddClient() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
			
		String client_name = request.getParameter("ClientName");	
		String client_address = request.getParameter("ClientPhysicalAddress");
		String client_number = request.getParameter("ClientNumber");
		
		String contact_email = request.getParameter("ContactEmailAddress");
		String contact_phone = request.getParameter("ContactNumber");
		String contact_name = request.getParameter("ContactName");
		
		double client_latitude = Double.parseDouble(request.getParameter("Latitude"));
		double client_longitude = Double.parseDouble(request.getParameter("Longitude"));
		
		Client c = new Client();
		c.setClient_Name(contact_name);
		c.setClient_EMail(contact_email);
		c.setClient_Address(client_address);
		c.setClient_PhoneNum(contact_phone);
		c.setClient_Latitude(client_latitude);
		c.setCompany_Name(client_name);
		c.setCompany_Phone(client_number);
		c.setClient_Longitude(client_longitude);
		
		em.getTransaction().begin();
		em.persist(c);
		em.getTransaction().commit();
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
