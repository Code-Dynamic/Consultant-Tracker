package com.ConsultantTracker.model;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-08-18T22:01:14.938+0200")
@StaticMetamodel(Daily_Times.class)
public class Daily_Times_ {
	public static volatile SingularAttribute<Daily_Times, Integer> entry_ID;
	public static volatile SingularAttribute<Daily_Times, Consultant> consultant;
	public static volatile SingularAttribute<Daily_Times, Assigned_Task> assigned_task;
	public static volatile SingularAttribute<Daily_Times, Double> time;
	public static volatile SingularAttribute<Daily_Times, Date> date;
}
