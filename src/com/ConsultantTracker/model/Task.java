package com.ConsultantTracker.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Task
 *
 */
@Entity

public class Task implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int task_ID;
	

	@Temporal(TemporalType.DATE)
	private Date Due_Date;
	private String Name;
	private String Description;
	private Project project;
	private boolean billable;
	private boolean completed;
	
	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public boolean getBillable() {
		return billable;
	}

	public void setBillable(boolean billable) {
		this.billable = billable;
	}
	
	

	public int getTask_ID() {
		return task_ID;
	}


	public void setTask_ID(int task_ID) {
		this.task_ID = task_ID;
	}


	public Date getDue_Date() {
		return Due_Date;
	}


	public void setDue_Date(Date due_Date) {
		Due_Date = due_Date;
	}


	public String getName() {
		return Name;
	}


	public void setName(String name) {
		Name = name;
	}


	public String getDescription() {
		return Description;
	}


	public void setDescription(String description) {
		Description = description;
	}


	public Project getProject() {
		return project;
	}


	public void setProject(Project project) {
		this.project = project;
	}


	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Task() {
		
	}
   
}
