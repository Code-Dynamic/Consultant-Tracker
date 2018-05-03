package com.ConsultantTracker.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import com.ConsultantTracker.model.Project;


/**
 * The persistent class for the assignment database table.
 * 
 */
@Entity
@NamedQuery(name="allAssignments", query="SELECT a FROM Assignment a join Project p on a.project=p.project_ID")
public class Assignment implements Serializable {
	private static final long serialVersionUID = 1L;


	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int assignment_ID;

	private Consultant consultant;


	private Project project;

	//bi-directional one-to-one association to Consultant


	public Assignment() {
	}

	public int getAssignment_ID() {
		return this.assignment_ID;
	}

	public void setAssignment_ID(int assignment_ID) {
		this.assignment_ID = assignment_ID;
	}

	public Consultant getConsultant() {
		return this.consultant;
	}

	public void setConsultant1(Consultant consultant) {
		this.consultant = consultant;
	}

	public Project getProject() {
	    return project;
	}

	public void setProject(Project param) {
	    this.project = param;
	}


}