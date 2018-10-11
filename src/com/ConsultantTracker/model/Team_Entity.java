package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: Team_Entity
 *
 */
@Entity

public class Team_Entity implements Serializable {
	
	private static final long serialVersionUID = 1L;

	//Sequence generator is found in the project.java model
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="primaryKeyGenerator")
	private int team_Entity_ID;
	
	@JoinColumn(name = "TEAM_ID")
	private Team team;
	
	private Consultant team_Member;
	
	public Team_Entity() {
		super();
	}
	public int getTeam_Entity_ID() {
		return team_Entity_ID;
	}
	public void setTeam_Entity_ID(int team_Entity_ID) {
		this.team_Entity_ID = team_Entity_ID;
	}
	public Team getTeam() {
		return team;
	}
	public void setTeam_ID(Team team) {
		this.team = team;
	}
	public Consultant getTeam_Member() {
		return team_Member;
	}
	public void setTeam_Member(Consultant team_Member) {
		this.team_Member = team_Member;
	}
}
