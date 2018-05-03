package com.ConsultantTracker.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


/**
 * The persistent class for the projects database table.
 * 
 */
@Entity
@NamedQuery(name="Project.findAll", query="SELECT p FROM Project p")
public class Project implements Serializable {

	private static final long serialVersionUID = 1L;


	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int project_ID;

	@Temporal(TemporalType.DATE)
	private Date project_Deadline;

	private boolean project_Deleted;

	private String project_Description;

	private String project_Name;

	private boolean project_OnSite;

	private Client client;

	public Project() {
	}

	public int getProject_ID() {
		return this.project_ID;
	}

	public void setProject_ID(int project_ID) {
		this.project_ID = project_ID;
	}

	public Date getProject_Deadline() {
		return this.project_Deadline;
	}

	public void setProject_Deadline(Date project_Deadline) {
		this.project_Deadline = project_Deadline;
	}

	public boolean getProject_Deleted() {
		return this.project_Deleted;
	}

	public void setProject_Deleted(boolean project_Deleted) {
		this.project_Deleted = project_Deleted;
	}

	public String getProject_Description() {
		return this.project_Description;
	}

	public void setProject_Description(String project_Description) {
		this.project_Description = project_Description;
	}

	public String getProject_Name() {
		return this.project_Name;
	}

	public void setProject_Name(String project_Name) {
		this.project_Name = project_Name;
	}

	public boolean getProject_OnSite() {
		return this.project_OnSite;
	}

	public void setProject_OnSite(boolean project_OnSite) {
		this.project_OnSite = project_OnSite;
	}

	

	public Client getClient() {
		return this.client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

}