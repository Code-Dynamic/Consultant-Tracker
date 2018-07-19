package com.ConsultantTracker.model;

import java.io.Serializable;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Ratings
 *
 */
@Entity
public class Ratings implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int rate_ID;
	
	private Project project;
	private Consultant consultant;
	private double rating;
	private int num_Votes;
	private int year;
	
	public int getRate_ID() {
		return rate_ID;
	}

	public void setRate_ID(int rateID) {
		this.rate_ID = rateID;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}
		
	public Consultant getConsultant() {
		return consultant;
	}

	public void setConsultant(Consultant consultant) {
		this.consultant = consultant;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}
	
	public int getNum_Votes() {
		return num_Votes;
	}

	public void setNum_Votes(int votes) {
		this.num_Votes = votes;
	}
	
	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}	
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}
