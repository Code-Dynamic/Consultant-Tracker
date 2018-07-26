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
	
	@OneToOne
	@JoinColumn(name = "CONSULTANT_CONSULTANT_ID")
	private Consultant consultant;
	private double general_Time;
	private double total_Assigned_Tasks_Time;
	@Temporal(TemporalType.DATE)
	private Date date;
	
	public Date getDate() {
		return date;
	}
	
//random comment
	
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

	public double getGeneral_Time() {
		return general_Time;
	}

	public void setGeneral_Time(double general_Time) {
		this.general_Time = general_Time;
	}

	public double getTotal_Assigned_Tasks_Time() {
		return total_Assigned_Tasks_Time;
	}

	public void setTotal_Assigned_Tasks_Time(double total_Assigned_Tasks_Time) {
	}
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
   
}