package com.ConsultantTracker.servlet;

import java.io.IOException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.ConsultantTracker.model.Attachment;
import com.ConsultantTracker.model.Client;
import com.ConsultantTracker.model.Project;

/**
 * Servlet implementation class AddFolder
 */
@WebServlet("/AddFolder")
public class AddFolder extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    private ServletFileUpload uploader = null;
	@Override
	public void init() throws ServletException{
		DiskFileItemFactory fileFactory = new DiskFileItemFactory();
		File filesDir = (File) getServletContext().getAttribute("FILES_DIR_FILE");
		fileFactory.setRepository(filesDir);
		this.uploader = new ServletFileUpload(fileFactory);
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String fileName = request.getParameter("fileName");
		if(fileName == null || fileName.equals("")){
			throw new ServletException("File Name can't be null or empty");
		}
		File file = new File("C:\\Users\\steph\\Desktop\\"+fileName);
		if(!file.exists()){
			throw new ServletException("File doesn't exists on server.");
		}
		System.out.println("File location on server::"+file.getAbsolutePath());
		ServletContext ctx = getServletContext();
		InputStream fis = new FileInputStream(file);
		String mimeType = ctx.getMimeType(file.getAbsolutePath());
		response.setContentType(mimeType != null? mimeType:"application/octet-stream");
		response.setContentLength((int) file.length());
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
		
		ServletOutputStream os = response.getOutputStream();
		byte[] bufferData = new byte[1024];
		int read=0;
		while((read = fis.read(bufferData))!= -1){
			os.write(bufferData, 0, read);
		}
		os.flush();
		os.close();
		fis.close();
		System.out.println("File downloaded at client successfully");
		
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if(!ServletFileUpload.isMultipartContent(request)){
			throw new ServletException("Content type is not multipart/form-data");
		}
		
		
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.write("<html><head></head><body>");
		try {
			List<FileItem> fileItemsList = uploader.parseRequest(request);
			Iterator<FileItem> fileItemsIterator = fileItemsList.iterator();
			if(fileItemsIterator.hasNext()){
				FileItem fileItem = fileItemsIterator.next();
				System.out.println("FieldName="+fileItem.getFieldName());
				System.out.println("FileName="+fileItem.getName());
				System.out.println("ContentType="+fileItem.getContentType());
				System.out.println("Size in bytes="+fileItem.getSize());
				
				System.out.println(request.getServletContext().getAttribute("FILES_DIR"));
				String s ="C:\\Users\\steph\\Desktop\\";
				
				File file = new File(fileItem.getName());
				System.out.println("Absolute Path at server="+file.getAbsolutePath());
				fileItem.write(file);
				out.write("File "+fileItem.getName()+ " uploaded successfully.");
				out.write("<br>");
				out.write(fileItem.getName());
				out.write("<a href=\"AddFolder?fileName="+fileItem.getName()+"\">Download "+fileItem.getName()+"</a>");
			
				EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPATest");
				EntityManager em = emf.createEntityManager();

			
				int p_ID =1;
				Project p = em.find(Project.class, p_ID);
				Attachment a = new Attachment();
				a.setAttachment_Name(fileItem.getName());
				a.setAttachment_Path(file.getAbsolutePath());
				a.setAttachment_Project_ID(p);
				a.setAttachment_Size(fileItem.getSize());
				a.setAttachment_Type( fileItem.getContentType());
				
				SimpleDateFormat sdf =new SimpleDateFormat("yyyy-MM-dd");
				Date uploadDate = new Date();
				try {
					uploadDate = sdf.parse(LocalDate.now().toString());
				} catch (ParseException e) {
					e.printStackTrace();
				}
				a.setAttachment_Upload_Date(uploadDate);
				em.getTransaction().begin();
				em.persist(a);
				em.getTransaction().commit();
				

				
			}
		} catch (FileUploadException e) {
			out.write("Exception in uploading file.1");
			System.out.print(e);
		} catch (Exception e) {
			out.write("Exception in uploading file.2");
			System.out.print(e);
		}
		out.write("</body></html>");
	}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	
}
