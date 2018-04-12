//package com.ConsultantTracker.util;
//import java.io.Serializable;
//import javax.persistence.*;
//
//@Entity
//@Table
//public class Project implements Serializable{
//	private static final long serialVersionUID = 1L;
//	@Id @GeneratedValue(strategy = GenerationType.AUTO) 
//	int id;
//	private String Name;
//	private int ClientID;
//	private String Description;
//	private String Deadline;
//	private boolean onSite;
//	private boolean deleted;
//	
//	
//	public Project(int id, String name, int clientID, String description, String deadline, boolean onSite,
//			boolean deleted) {
//		super();
//		this.id = id;
//		Name = name;
//		ClientID = clientID;
//		Description = description;
//		Deadline = deadline;
//		this.onSite = onSite;
//		this.deleted = deleted;
//	}
//	// get set ID
//	public int getId() {
//		return id;
//	}
//	public void setId(int id) {
//		this.id = id;
//	}
//	
//	//get set Name
//	public String getName() {
//		return Name;
//	}
//	public void setName(String name) {
//		Name = name;
//	}
//	
//	//get set description
//	public String getDescription() {
//		return Description;
//	}
//	public void setDescription(String description) {
//		Description = description;
//	}
//	
//	//get set deadline
//	public String getDeadline() {
//		return Deadline;
//	}
//	public void setDeadline(String deadline) {
//		Deadline = deadline;
//	}
//	
//	// get set onSite
//	public boolean isOnSite() {
//		return onSite;
//	}
//	public void setOnSite(boolean onSite) {
//		this.onSite = onSite;
//	}
//	
//	//get set ClientID
//	public int getClientID() {
//		return ClientID;
//	}
//	public void setClientID(int clientID) {
//		ClientID = clientID;
//	}
//	//get set deleted
//	public boolean isDeleted() {
//		return deleted;
//	}
//	public void setDeleted(boolean deleted) {
//		this.deleted = deleted;
//	}
//	
//	public String toString() {
//		return "ID: "+getId()+", Name:"+getName()+", Description: "+getDescription()+", ClientID: "+getClientID()
//				+", Deadline: "+getDeadline()+", On-Site: "+isOnSite()+", Deleted: "+isDeleted();
//	}
//	
//}
