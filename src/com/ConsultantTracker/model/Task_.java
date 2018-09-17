package com.ConsultantTracker.model;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-09-17T19:08:57.196+0200")
@StaticMetamodel(Task.class)
public class Task_ {
	public static volatile SingularAttribute<Task, Integer> task_ID;
	public static volatile SingularAttribute<Task, Date> Due_Date;
	public static volatile SingularAttribute<Task, String> Name;
	public static volatile SingularAttribute<Task, String> Description;
	public static volatile SingularAttribute<Task, Project> project;
	public static volatile SingularAttribute<Task, Boolean> billable;
	public static volatile SingularAttribute<Task, Boolean> completed;
}
