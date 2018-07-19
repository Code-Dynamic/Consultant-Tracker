package com.ConsultantTracker.model;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T13:02:55.151+0200")
@StaticMetamodel(Daily_Times.class)
public class Daily_Times_ {
	public static volatile SingularAttribute<Daily_Times, Integer> entry_ID;
	public static volatile SingularAttribute<Daily_Times, Consultant> consultant;
	public static volatile SingularAttribute<Daily_Times, Double> general_Time;
	public static volatile SingularAttribute<Daily_Times, Double> total_Assigned_Tasks_Time;
	public static volatile SingularAttribute<Daily_Times, Date> date;
}
