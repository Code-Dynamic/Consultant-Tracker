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

	//Sequence generator is found in the project.java model
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int team_ID;


	@JoinColumn(name = "TEAM_LEADER")
	private Consultant team_Leader;

	public Team() {
	}

	public int getTeam_ID() {
		return team_ID;
	}

	public void setTeam_ID(int team_ID) {
		this.team_ID = team_ID;
	}

	public Consultant getTeam_Leader() {
		return team_Leader;
	}

	public void setTeam_Leader(Consultant team_Leader) {
		this.team_Leader = team_Leader;
	}
}