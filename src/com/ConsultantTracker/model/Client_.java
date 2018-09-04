package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-09-04T10:53:09.857+0200")
@StaticMetamodel(Client.class)
public class Client_ {
	public static volatile SingularAttribute<Client, Integer> client_ID;
	public static volatile SingularAttribute<Client, String> client_Address;
	public static volatile SingularAttribute<Client, String> client_EMail;
	public static volatile SingularAttribute<Client, String> client_Name;
	public static volatile SingularAttribute<Client, String> client_PhoneNum;
	public static volatile SingularAttribute<Client, Double> client_Latitude;
	public static volatile SingularAttribute<Client, Double> client_Longitude;
}
