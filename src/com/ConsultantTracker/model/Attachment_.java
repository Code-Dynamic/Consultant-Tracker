package com.ConsultantTracker.model;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="Dali", date="2018-07-19T11:06:54.197+0200")
@StaticMetamodel(Attachment.class)
public class Attachment_ {
	public static volatile SingularAttribute<Attachment, Integer> attachment_ID;
	public static volatile SingularAttribute<Attachment, String> attachment_Name;
	public static volatile SingularAttribute<Attachment, String> attachment_Path;
	public static volatile SingularAttribute<Attachment, Project> attachment_Project_ID;
	public static volatile SingularAttribute<Attachment, Double> attachment_Size;
	public static volatile SingularAttribute<Attachment, String> attachment_Type;
	public static volatile SingularAttribute<Attachment, Date> attachment_Upload_Date;
}
