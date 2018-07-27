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
//		Connection con = (Connection) getServletContext().getAttribute("DBConnection");
//		PreparedStatement ps = null;
//		ResultSet rs = null;
//		try {
//			ps = con.prepareStatement("select * from client");				
//			rs = ps.executeQuery();
//			if(rs != null){
//				String ObjToReturn="";
//				while(rs.next()) {
//					if(!ObjToReturn.equals(""))
//						ObjToReturn +=";";
//				 ObjToReturn +=rs.getString("Client_Name")+','+rs.getString("Client_EMail")+','+rs.getString("Client_PhoneNum")+','+rs.getString("Client_Address")+','+rs.getString("Client_ID") ;
//			
//				}
//				PrintWriter out = response.getWriter();
//				//out.wr(ObjToReturn);
//				response.setContentType("text/plain");
//				out.write(ObjToReturn);
//			}else{
//				RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
//				PrintWriter out= response.getWriter();
//				//logger.error("User not found with email="+email);
//				out.println("<font color=red>No user found with given email id, please register first.</font>");
//				rd.include(request, response);
//			}
//		} catch (SQLException e) {
//			e.printStackTrace();
//			//logger.error("Database connection problem");
//			throw new ServletException("DB Connection problem.");
//		}finally{
//			try {
//				rs.close();
//				ps.close();
//			} catch (SQLException e) {
//				//logger.error("SQLException in closing PreparedStatement or ResultSet");;
//			}
//			
//		}
}
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
