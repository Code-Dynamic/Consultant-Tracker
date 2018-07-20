package com.ConsultantTracker.model;

import java.io.Serializable;
import java.util.Date;


import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;

import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
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
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	@SequenceGenerator(name="primaryKeyGenerator", initialValue = 1, sequenceName = "PR_KEY_GEN", allocationSize = 1)
	private int project_ID;

	@Temporal(TemporalType.DATE)
	private Date project_Deadline;

	private boolean project_Deleted;

	private String project_Description;

	private String project_Name;

	private boolean project_OnSite;


	private boolean project_Completed;

	@Temporal(TemporalType.DATE)
	private Date project_StartDate;

	@OneToOne
	@JoinColumn(name = "CLIENT_ID")
	private Client client_ID;
	
	@OneToOne
	@JoinColumn(name = "PROJECT_CREATOR")
	private Consultant project_Creator;

	public Project() {
	}
	
	public Consultant getProject_Creator() {
		return project_Creator;
	}

	public void setProject_Creator(Consultant project_Creator) {
		this.project_Creator = project_Creator;
	}

	public Client getClient_ID() {
		return client_ID;
	}

	public void setClient_ID(Client client_ID) {
		this.client_ID = client_ID;
	}

	public int getProject_ID() {
		return this.project_ID;
	}

	public void setProject_ID(int project_ID) {
		this.project_ID = project_ID;
	}

	public Date getProject_StartDate() {
		return this.project_StartDate;
	}

	public void setProject_StartDate(Date project_StartDate) {
		this.project_StartDate = project_StartDate;
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
	public boolean getProject_Completed() {
		return this.project_Completed;
	}

	public void setProject_Completed(boolean project_Completed) {
		this.project_Completed = project_Completed;
	}	

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}