package com.ConsultantTracker.model;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T20:14:00.695+0200")
@StaticMetamodel(Feedback.class)
public class Feedback_ {
	public static volatile SingularAttribute<Feedback, Integer> Feedback_ID;
	public static volatile SingularAttribute<Feedback, String> message;
	public static volatile SingularAttribute<Feedback, Date> date;
	public static volatile SingularAttribute<Feedback, Project> project;
	public static volatile SingularAttribute<Feedback, Consultant> consultant_ID;
	public static volatile SingularAttribute<Feedback, Task> task_ID;
}
