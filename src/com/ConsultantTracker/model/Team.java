package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the teams database table.
 * 
 */
@Entity
@NamedQuery(name="Team.findAll", query="SELECT t FROM Team t")
public class Team implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int team_ID;

	private String team_Description;

	//bi-directional many-to-one association to Consultant
	
	private Consultant consultant;

	public Team() {
	}

	public int getTeam_ID() {
		return this.team_ID;
	}

	public void setTeam_ID(int team_ID) {
		this.team_ID = team_ID;
	}

	public String getTeam_Description() {
		return this.team_Description;
	}

	public void setTeam_Description(String team_Description) {
		this.team_Description = team_Description;
	}

	public Consultant getConsultant() {
		return this.consultant;
	}

	public void setConsultant(Consultant consultant) {
		this.consultant = consultant;
	}

}