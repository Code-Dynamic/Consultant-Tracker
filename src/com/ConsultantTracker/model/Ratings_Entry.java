package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: Ratings_Entry
 *
 */
@Entity

public class Ratings_Entry implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int rate_Entry_ID;
	
	private Project project;
	private Consultant consultant;
	
	public int getRate_Entry_ID() {
		return rate_Entry_ID;
	}

	public void setRate_Entry_ID(int rate_Entry_ID) {
		this.rate_Entry_ID = rate_Entry_ID;
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
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
   
}
