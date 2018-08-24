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

import com.ConsultantTracker.model.Assignment;
import com.ConsultantTracker.model.Consultant;
import com.ConsultantTracker.model.Daily_Times;
import com.ConsultantTracker.model.Project;




/**
 * Servlet implementation class getProjects
 * 
 * returns string in the form 'Project_Name','Project_Description','Client_Name','Project_Deadline,'Project_OnSite'
 */
//Replaced with Odata Service
@WebServlet("/getProjectConsultants")
public class getProjectConsultants extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getProjectConsultants() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
			String proj_ID = request.getParameter("projectID");

			EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
			EntityManager em = emf.createEntityManager();
			java.util.List<Assignment> consultantList;
				if(proj_ID != null) {
					Project p = em.find(Project.class, Integer.parseInt(proj_ID));
				 consultantList = em.createQuery("SELECT a FROM Assignment a WHERE a.project=:proj",Assignment.class)
			                .setParameter("proj", p).getResultList();

				}
				else
					consultantList = em.createQuery("SELECT a FROM Assignment a",Assignment.class).getResultList();

				if(consultantList != null){
					
					String ObjToReturn="";
					for(int i=0;i<consultantList.size();i++) {
						if(!ObjToReturn.equals(""))
							ObjToReturn +=";";
						Consultant c = consultantList.get(i).getConsultant();
						 ObjToReturn +=c.getConsultant_ID() +','+c.getConsultant_Name()+','+
								 c.getConsultant_Surname()+','+c.getConsultant_email()+','+
								 c.getConsultant_Cell()+','+c.getConsultant_Admin();
						 
//					 
					 if(proj_ID != null)
						 ObjToReturn +=','+consultantList.get(i).getAssignment_ID();
				
					}
				
					response.setContentType("text/plain");
					response.getWriter().write(ObjToReturn);
				}else{
					RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
					PrintWriter out= response.getWriter();
					//logger.error("User not found with email="+email);
					out.println("<font color=red>No user found with given email id, please register first.</font>");
					rd.include(request, response);
				}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
