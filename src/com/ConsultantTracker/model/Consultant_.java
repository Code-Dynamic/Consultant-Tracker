package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-10-08T09:10:19.973+0200")
@StaticMetamodel(Consultant.class)
public class Consultant_ {
	public static volatile SingularAttribute<Consultant, Integer> consultant_ID;
	public static volatile SingularAttribute<Consultant, String> consultant_Cell;
	public static volatile SingularAttribute<Consultant, String> consultant_Name;
	public static volatile SingularAttribute<Consultant, String> consultant_Surname;
	public static volatile SingularAttribute<Consultant, User_Type> consultant_Priviledge;
	public static volatile SingularAttribute<Consultant, String> consultant_Email;
}
