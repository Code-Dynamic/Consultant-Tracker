package com.ConsultantTracker.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-10-10T14:37:08.803+0200")
@StaticMetamodel(Client.class)
public class Client_ {
	public static volatile SingularAttribute<Client, Integer> client_ID;
	public static volatile SingularAttribute<Client, String> client_Address;
	public static volatile SingularAttribute<Client, String> client_EMail;
	public static volatile SingularAttribute<Client, String> client_Name;
	public static volatile SingularAttribute<Client, String> client_PhoneNum;
	public static volatile SingularAttribute<Client, Double> client_Latitude;
	public static volatile SingularAttribute<Client, Double> client_Longitude;
	public static volatile SingularAttribute<Client, Integer> company_phone;
	public static volatile SingularAttribute<Client, String> company_name;
}
