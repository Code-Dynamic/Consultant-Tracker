package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T11:06:54.237+0200")
@StaticMetamodel(Team.class)
public class Team_ {
	public static volatile SingularAttribute<Team, Integer> team_ID;
	public static volatile SingularAttribute<Team, String> team_Description;
	public static volatile SingularAttribute<Team, Consultant> consultant;
}
