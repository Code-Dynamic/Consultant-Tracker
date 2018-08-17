package com.ConsultantTracker.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Daily_Times
 *
 */
@Entity

public class Daily_Times implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int entry_ID;
	private Consultant consultant;
	private Assigned_Task assigned_task;
	private double time;
	@Temporal(TemporalType.DATE)
	private Date date;
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}

	public Daily_Times() {
		
	}

	public int getEntry_ID() {
		return entry_ID;
	}

	public void setEntry_ID(int entry_ID) {
		this.entry_ID = entry_ID;
	}

	public Consultant getConsultant() {
		return consultant;
	}

	public void setConsultant(Consultant consultant) {
		this.consultant = consultant;
	}

	public void setTotal_Assigned_Tasks_Time(double total_Assigned_Tasks_Time) {
	}
	
	public Assigned_Task getAssigned_task() {
		return assigned_task;
	}
	
	public void setAssigned_task(Assigned_Task assigned_task) {
		this.assigned_task = assigned_task;
	}
	
	public double getTime() {
		return time;
	}
	
	public void setTime(double time) {
		this.time = time;
	}
   
	public static long getSerialversionuid() {
		return serialVersionUID;
	}	
}