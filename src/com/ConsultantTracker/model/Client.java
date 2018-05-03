package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the client database table.
 * 
 */
@Entity
@NamedQuery(name="Client.findAll", query="SELECT c FROM Client c")
public class Client implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int client_ID;

	private String client_Address;

	private String client_EMail;

	private String client_Name;

	private String client_PhoneNum;

	public Client() {
	}

	public int getClient_ID() {
		return this.client_ID;
	}

	public void setClient_ID(int client_ID) {
		this.client_ID = client_ID;
	}

	public String getClient_Address() {
		return this.client_Address;
	}

	public void setClient_Address(String client_Address) {
		this.client_Address = client_Address;
	}

	public String getClient_EMail() {
		return this.client_EMail;
	}

	public void setClient_EMail(String client_EMail) {
		this.client_EMail = client_EMail;
	}

	public String getClient_Name() {
		return this.client_Name;
	}

	public void setClient_Name(String client_Name) {
		this.client_Name = client_Name;
	}

	public String getClient_PhoneNum() {
		return this.client_PhoneNum;
	}

	public void setClient_PhoneNum(String client_PhoneNum) {
		this.client_PhoneNum = client_PhoneNum;
	}

	
	

}