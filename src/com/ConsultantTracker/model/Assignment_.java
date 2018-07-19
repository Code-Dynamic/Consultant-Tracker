package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T11:06:54.193+0200")
@StaticMetamodel(Assignment.class)
public class Assignment_ {
	public static volatile SingularAttribute<Assignment, Integer> assignment_ID;
	public static volatile SingularAttribute<Assignment, Consultant> consultant;
	public static volatile SingularAttribute<Assignment, Project> project;
}
