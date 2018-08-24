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

import com.ConsultantTracker.model.Client;
import com.ConsultantTracker.model.Daily_Times;

/**
 * Servlet implementation class getClients
 * 
 * returns string "Client_Name","Client_EMail","Client_PhoneNum","Client_Address"
 */
//Replaced with Odata Service
@WebServlet("/getClients")
public class getClients extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getClients() {
        super();
        
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
		EntityManager em = emf.createEntityManager();
		
		java.util.List<Client> Clients = em.createQuery("SELECT * FROM Client",Client.class).getResultList();
		String ObjToReturn="";
	
		for(int i=0;i<Clients.size();i++) {
			Client c = Clients.get(i);
			ObjToReturn +=c.getClient_Name()+','+c.getClient_EMail()+','+c.getClient_PhoneNum()+','+c.getClient_Address()+','+c.getClient_ID() ;
		}
		PrintWriter out = response.getWriter();
		response.setContentType("text/plain");
		out.write(ObjToReturn);

}
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
