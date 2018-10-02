package com.ConsultantTracker.model;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: User_Type
 *
 */
@Entity

public class User_Type implements Serializable {

	
	private static final long serialVersionUID = 1L;

		@Id
		@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="userTypeGen")
		@SequenceGenerator(name="userTypeGen", initialValue = 100, sequenceName = "PR_KEY", allocationSize = 100)
		private int user_Type_Id;
		
		private String user_Type_Type;
		
		private String user_Type_Description;
		
		public User_Type() {
			super();
		}

		public int getUser_Type_Id() {
			return user_Type_Id;
		}

		public void setUser_Type_Id(int user_Type_Id) {
			this.user_Type_Id = user_Type_Id;
		}

		public String getUser_Type_Type() {
			return user_Type_Type;
		}

		public void setUser_Type_Type(String user_Type_Type) {
			this.user_Type_Type = user_Type_Type;
		}

		public String getUser_Type_Description() {
			return user_Type_Description;
		}

		public void setUser_Type_Description(String user_Type_Description) {
			this.user_Type_Description = user_Type_Description;
		}
}