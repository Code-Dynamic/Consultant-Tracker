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
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
//			Connection con = (Connection) getServletContext().getAttribute("DBConnection");
//			PreparedStatement ps = null;
//			ResultSet rs = null;
			String proj_ID = request.getParameter("projectID");
//			try {
			EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
			EntityManager em = emf.createEntityManager();
			java.util.List<Assignment> consultantList;
				if(proj_ID != null) {
					Project p = em.find(Project.class, Integer.parseInt(proj_ID));
				 consultantList = em.createQuery("SELECT a FROM Assignment a WHERE a.project=:proj",Assignment.class)
			                .setParameter("proj", p).getResultList();
//					ps = con.prepareStatement("select * from assignment join consultant on assignment.CONSULTANT_CONSULTANT_ID=consultants.CONSULTANT_ID where assignment.PROJECT_PROJECT_ID=?");				
//					ps.setString(1, proj_ID);
				}
				else
					consultantList = em.createQuery("SELECT a FROM Assignment a",Assignment.class).getResultList();
//					ps = con.prepareStatement("Select * from Consultant");
//					rs = ps.executeQuery();
				if(consultantList != null){
					
					//User user = new User(rs.getString("name"), rs.getString("email"), rs.getString("country"), rs.getInt("id"));
					//logger.info("User found with details="+user);
					//response.setContentType("application/json");
					String ObjToReturn="";
					for(int i=0;i<consultantList.size();i++) {
						if(!ObjToReturn.equals(""))
							ObjToReturn +=";";
						Consultant c = consultantList.get(i).getConsultant();
						 ObjToReturn +=c.getConsultant_ID() +','+c.getConsultant_Name()+','+
								 c.getConsultant_Surname()+','+c.getConsultant_email()+','+
								 c.getConsultant_Cell()+','+c.getConsultant_Admin();
						 
//					 ObjToReturn +=rs.getString("CONSULTANT_ID") +','+rs.getString("CONSULTANT_NAME")+','+
//							 rs.getString("CONSULTANT_SURNAME")+','+rs.getString("CONSULTANT_EMAIL")+','+
//							 rs.getString("CONSULTANT_CELL")+','+rs.getString("CONSULTANT_ADMIN");
					 if(proj_ID != null)
						 ObjToReturn +=','+consultantList.get(i).getAssignment_ID();
				
					}
					//PrintWriter out = response.getWriter();
					//out.wr(ObjToReturn);
					response.setContentType("text/plain");
					response.getWriter().write(ObjToReturn);
				}else{
					RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
					PrintWriter out= response.getWriter();
					//logger.error("User not found with email="+email);
					out.println("<font color=red>No user found with given email id, please register first.</font>");
					rd.include(request, response);
				}
//			} catch (SQLException e) {
//				e.printStackTrace();
//				//logger.error("Database connection problem");
//				 response.getWriter().println("Connection Failed");
//				throw new ServletException("DB Connection problem.");
//			}finally{
//				try {
//					if(rs != null)
//						rs.close();
//					if(ps != null)
//						ps.close();
//				} catch (SQLException e) {
//					//logger.error("SQLException in closing PreparedStatement or ResultSet");;
//				}
//				
//			}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
