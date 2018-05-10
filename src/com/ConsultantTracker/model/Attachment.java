package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the attachment database table.
 * 
 */
@Entity
@NamedQuery(name="Attachment.findAll", query="SELECT a FROM Attachment a")
public class Attachment implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int attachment_ID;

	private String attachment_Name;

	private String attachment_Path;
	
	@OneToOne
	@JoinColumn(name = "attachment_Project_ID")
	private Project attachment_Project_ID;

	private double attachment_Size;

	private String attachment_Type;

	@Temporal(TemporalType.DATE)
	private Date attachment_Upload_Date;

	public Attachment() {
	}

	public int getAttachment_ID() {
		return this.attachment_ID;
	}

	public void setAttachment_ID(int attachment_ID) {
		this.attachment_ID = attachment_ID;
	}

	public String getAttachment_Name() {
		return this.attachment_Name;
	}

	public void setAttachment_Name(String attachment_Name) {
		this.attachment_Name = attachment_Name;
	}

	public String getAttachment_Path() {
		return this.attachment_Path;
	}

	public void setAttachment_Path(String attachment_Path) {
		this.attachment_Path = attachment_Path;
	}

	public Project getAttachment_Project_ID() {
		return this.attachment_Project_ID;
	}

	public void setAttachment_Project_ID(Project attachment_Project_ID) {
		this.attachment_Project_ID = attachment_Project_ID;
	}

	public double getAttachment_Size() {
		return this.attachment_Size;
	}

	public void setAttachment_Size(double attachment_Size) {
		this.attachment_Size = attachment_Size;
	}

	public String getAttachment_Type() {
		return this.attachment_Type;
	}

	public void setAttachment_Type(String attachment_Type) {
		this.attachment_Type = attachment_Type;
	}

	public Date getAttachment_Upload_Date() {
		return this.attachment_Upload_Date;
	}

	public void setAttachment_Upload_Date(Date attachment_Upload_Date) {
		this.attachment_Upload_Date = attachment_Upload_Date;
	}

}