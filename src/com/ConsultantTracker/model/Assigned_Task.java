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
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int assigned_Task_ID;
	
	private Task task;
	private boolean task_Completed;
	private Consultant consultant;
	private double assigned_Hours;
	private double hours_Worked;
	@Temporal(TemporalType.DATE)
	private Date last_Update;
	@Temporal(TemporalType.DATE)
	private Date date_Assigned;
	@Temporal(TemporalType.DATE)
	private Date due_Date;
	@Temporal(TemporalType.DATE)
	private Date date_Completed;
	private String Description;
	
	public Assigned_Task() {
		
	}
	
	public String getDescription() {
		return Description;
	}
	
 	public void setDescription(String description) {
		Description = description;
	}
 	
	public Date getDate_Assigned() {
		return date_Assigned;
	}
	
	public void setDate_Assigned(Date date_Assigned) {
		this.date_Assigned = date_Assigned;
	}

	public Date getDue_Date() {
		return due_Date;
	}

	public void setDue_Date(Date due_Date) {
		this.due_Date = due_Date;
	}

	public int getAssigned_Task_ID() {
		return assigned_Task_ID;
	}

	public void setAssigned_task_ID(int assigned_task_ID) {
		assigned_Task_ID = assigned_task_ID;
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

	public boolean getTask_Completed() {
		return this.task_Completed;
	}

	public void setTask_Completed(boolean taskCompleted) {
		this.task_Completed = taskCompleted;
	}
	
	public Date getDate_Completed() {
		return date_Completed;
	}

	public void setDate_Completed(Date completion_Date) {
		this.date_Completed = completion_Date;
	}	
	
	public void subtractHoursWorked(double time) {
		this.hours_Worked -= time;
	}
	
	public void addHoursWorked(double time) {
		this.hours_Worked += time;
	}	
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
   
}
