package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the users database table.
 * 
 */
@Entity
@NamedQuery(name="User.findAll", query="SELECT u FROM User u")
public class User implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	int id;
	
	@OneToOne
	@JoinColumn(name = "CONSULTANTID")
	private Consultant consultantID;

	private String password;

	public User() {
	}

	public Consultant getConsultantID() {
		return consultantID;
	}

	public void setConsultantID(Consultant consultantID) {
		this.consultantID = consultantID;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}


}