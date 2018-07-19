package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T11:06:54.225+0200")
@StaticMetamodel(Ratings.class)
public class Ratings_ {
	public static volatile SingularAttribute<Ratings, Integer> rate_ID;
	public static volatile SingularAttribute<Ratings, Project> project;
	public static volatile SingularAttribute<Ratings, Consultant> consultant;
	public static volatile SingularAttribute<Ratings, Double> rating;
	public static volatile SingularAttribute<Ratings, Integer> num_Votes;
	public static volatile SingularAttribute<Ratings, Integer> year;
}
