package com.ConsultantTracker.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Feedback
 *
 */
@Entity

public class Feedback implements Serializable {

	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int Feedback_ID;
	
	@OneToOne
	@JoinColumn(name = "TASK_ID")
	private Task task_ID;
	
	@OneToOne
	@JoinColumn(name = "CONSULTANT_ID")
	private Consultant consultant_ID;
	
	private String message;
	
	@Temporal(TemporalType.DATE)
	private Date date;

	private Project project;
	

	public Feedback() {
	
	}


	public int getFeedback_ID() {
		return Feedback_ID;
	}


	public void setFeedback_ID(int feedback_ID) {
		Feedback_ID = feedback_ID;
	}


	public Task getTask_ID() {
		return task_ID;
	}


	public void setTask_ID(Task task_ID) {
		this.task_ID = task_ID;
	}


	public Consultant getConsultant_ID() {
		return consultant_ID;
	}


	public void setConsultant_ID(Consultant consultant_ID) {
		this.consultant_ID = consultant_ID;
	}


	public String getMessage() {
		return message;
	}


	public void setMessage(String message) {
		this.message = message;
	}


	public Date getDate() {
		return date;
	}


	public void setDate(Date date) {
		this.date = date;
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
   
}
