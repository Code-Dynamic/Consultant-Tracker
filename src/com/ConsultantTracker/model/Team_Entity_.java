package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-09-28T14:25:09.412+0200")
@StaticMetamodel(Team_Entity.class)
public class Team_Entity_ {
	public static volatile SingularAttribute<Team_Entity, Integer> team_Entity_ID;
	public static volatile SingularAttribute<Team_Entity, Team> team;
	public static volatile SingularAttribute<Team_Entity, Consultant> team_Member;
}
