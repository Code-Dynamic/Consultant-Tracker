package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T11:06:54.229+0200")
@StaticMetamodel(Ratings_Entry.class)
public class Ratings_Entry_ {
	public static volatile SingularAttribute<Ratings_Entry, Integer> rate_Entry_ID;
	public static volatile SingularAttribute<Ratings_Entry, Project> project;
	public static volatile SingularAttribute<Ratings_Entry, Consultant> consultant;
}
