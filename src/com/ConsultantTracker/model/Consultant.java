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

	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int consultant_ID;

	private int consultant_Admin;

	private String consultant_Cell;

	private String consultant_email;

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

	public int getConsultant_Admin() {
		return this.consultant_Admin;
	}

	public void setConsultant_Admin(int consultant_Admin) {
		this.consultant_Admin = consultant_Admin;
	}

	public String getConsultant_Cell() {
		return this.consultant_Cell;
	}

	public void setConsultant_Cell(String consultant_Cell) {
		this.consultant_Cell = consultant_Cell;
	}

	public String getConsultant_email() {
		return this.consultant_email;
	}

	public void setConsultant_email(String consultant_email) {
		this.consultant_email = consultant_email;
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

}