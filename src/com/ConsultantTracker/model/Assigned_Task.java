package com.ConsultantTracker.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Assigned_Task
 *
 */
@Entity

public class Assigned_Task implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int Assigned_task_ID;
	
	private Task task;
	private Consultant consultant;
	private double assigned_Hours;
	private double hours_Worked;
	@Temporal(TemporalType.DATE)
	private Date last_Update;
	@Temporal(TemporalType.DATE)
	private Date Date_Assigned;
	public Date getDate_Assigned() {
		return Date_Assigned;
	}
//random comment
	
	public void setDate_Assigned(Date date_Assigned) {
		Date_Assigned = date_Assigned;
	}

	public Date getDue_Date() {
		return Due_Date;
	}

	public void setDue_Date(Date due_Date) {
		Due_Date = due_Date;
	}

	@Temporal(TemporalType.DATE)
	private Date Due_Date;
	
	public Assigned_Task() {
		
	}

	public int getAssigned_task_ID() {
		return Assigned_task_ID;
	}

	public void setAssigned_task_ID(int assigned_task_ID) {
		Assigned_task_ID = assigned_task_ID;
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public Consultant getConsultant() {
		return consultant;
	}

	public void setConsultant(Consultant consultant) {
		this.consultant = consultant;
	}

	public double getAssigned_Hours() {
		return assigned_Hours;
	}

	public void setAssigned_Hours(double assigned_Hours) {
		this.assigned_Hours = assigned_Hours;
	}

	public double getHours_Worked() {
		return hours_Worked;
	}

	public void setHours_Worked(double hours_Worked) {
		this.hours_Worked = hours_Worked;
	}

	public Date getLast_Update() {
		return last_Update;
	}

	public void setLast_Update(Date last_Update) {
		this.last_Update = last_Update;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
   
}
