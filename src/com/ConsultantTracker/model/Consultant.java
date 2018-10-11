package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the consultants database table.
 * 
 */
@Entity
@NamedQuery(name="Consultant.findAll", query="SELECT c FROM Consultant c")
public class Consultant implements Serializable {
	private static final long serialVersionUID = 1L;

	//Sequence generator is found in the project.java model
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int consultant_ID;

	@JoinColumn(name = "CONSULTANT_PRIVILEDGE")
	private User_Type consultant_Priviledge;

	private String consultant_Cell;

	private String consultant_Email;

	private String consultant_Name;

	private String consultant_Surname;

	public Consultant() {
	}

	public int getConsultant_ID() {
		return this.consultant_ID;
	}

	public void setConsultant_ID(int consultant_ID) {
		this.consultant_ID = consultant_ID;
	}

	public String getConsultant_Cell() {
		return this.consultant_Cell;
	}

	public void setConsultant_Cell(String consultant_Cell) {
		this.consultant_Cell = consultant_Cell;
	}

	public String getConsultant_Email() {
		return consultant_Email;
	}

	public void setConsultant_Email(String consultant_Email) {
		this.consultant_Email = consultant_Email;
	}

	public String getConsultant_Name() {
		return this.consultant_Name;
	}

	public void setConsultant_Name(String consultant_Name) {
		this.consultant_Name = consultant_Name;
	}

	public String getConsultant_Surname() {
		return this.consultant_Surname;
	}

	public void setConsultant_Surname(String consultant_Surname) {
		this.consultant_Surname = consultant_Surname;
	}
	public User_Type getConsultant_Priviledge() {
		return consultant_Priviledge;
	}

	public void setConsultant_Priviledge(User_Type consultant_Priviledge) {
		this.consultant_Priviledge = consultant_Priviledge;
	}
}