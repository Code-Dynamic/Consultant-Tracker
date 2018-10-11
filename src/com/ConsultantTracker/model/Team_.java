package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-09-28T10:20:59.129+0200")
@StaticMetamodel(Team.class)
public class Team_ {
	public static volatile SingularAttribute<Team, Integer> team_ID;
	public static volatile SingularAttribute<Team, Consultant> team_Leader;
}
