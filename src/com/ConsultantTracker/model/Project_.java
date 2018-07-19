package com.ConsultantTracker.model;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T19:45:39.350+0200")
@StaticMetamodel(Project.class)
public class Project_ {
	public static volatile SingularAttribute<Project, Integer> project_ID;
	public static volatile SingularAttribute<Project, Date> project_Deadline;
	public static volatile SingularAttribute<Project, Boolean> project_Deleted;
	public static volatile SingularAttribute<Project, String> project_Description;
	public static volatile SingularAttribute<Project, String> project_Name;
	public static volatile SingularAttribute<Project, Boolean> project_OnSite;
	public static volatile SingularAttribute<Project, Boolean> project_Completed;
	public static volatile SingularAttribute<Project, Date> project_StartDate;
	public static volatile SingularAttribute<Project, Client> client_ID;
	public static volatile SingularAttribute<Project, Consultant> project_Creator;
}
