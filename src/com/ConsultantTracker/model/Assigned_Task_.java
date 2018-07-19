package com.ConsultantTracker.model;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T11:06:54.166+0200")
@StaticMetamodel(Assigned_Task.class)
public class Assigned_Task_ {
	public static volatile SingularAttribute<Assigned_Task, Integer> assigned_Task_ID;
	public static volatile SingularAttribute<Assigned_Task, Task> task;
	public static volatile SingularAttribute<Assigned_Task, Consultant> consultant;
	public static volatile SingularAttribute<Assigned_Task, Double> assigned_Hours;
	public static volatile SingularAttribute<Assigned_Task, Double> hours_Worked;
	public static volatile SingularAttribute<Assigned_Task, Date> last_Update;
	public static volatile SingularAttribute<Assigned_Task, Date> date_Assigned;
	public static volatile SingularAttribute<Assigned_Task, Date> due_Date;
	public static volatile SingularAttribute<Assigned_Task, Boolean> task_Completed;
}
