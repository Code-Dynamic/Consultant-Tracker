package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-10-07T20:22:59.362+0200")
@StaticMetamodel(User.class)
public class User_ {
	public static volatile SingularAttribute<User, Integer> id;
	public static volatile SingularAttribute<User, Consultant> consultant_ID;
	public static volatile SingularAttribute<User, String> password;
	public static volatile SingularAttribute<User, Boolean> completed;
}
