package com.ConsultantTracker.model;

import java.io.Serializable;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.persistence.*;


/**
 * The persistent class for the users database table.
 * 
 */
@Entity
@NamedQuery(name="User.findAll", query="SELECT u FROM User u")
public class User implements Serializable {
	private static final long serialVersionUID = 1L;

	//Sequence generator is found in the project.java model
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	int id;
	
	@OneToOne
	@JoinColumn(name = "CONSULTANT_ID")
	private Consultant consultant_ID;

	private String password;
	private boolean completed;
	private String security_Question;
	private String security_Answer;
	
	public User() {
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Consultant getConsultant_ID() {
		return consultant_ID;
	}

	public void setConsultant_ID(Consultant consultant_ID) {
		this.consultant_ID = consultant_ID;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = hashPassword(password);
	}

	protected String hashPassword(String password) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			System.out.println(password);
			digest.update(password.getBytes());
			return new sun.misc.BASE64Encoder().encode(digest.digest());
		} 
		catch (NoSuchAlgorithmException error) {
			error.printStackTrace();
		}
		return null;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public String getSecurity_Question() {
		return security_Question;
	}

	public void setSecurity_Question(String security_Question) {
		this.security_Question = security_Question;
	}

	public String getSecurity_Answer() {
		return security_Answer;
	}

	public void setSecurity_Answer(String security_Answer) {
		this.security_Answer = hashPassword(security_Answer);
	}
}