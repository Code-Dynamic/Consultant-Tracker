package org.persistence;

import java.io.Serializable;
import javax.persistence.*;

@Entity
public class Entity2 implements Serializable {

	private static final long serialVersionUID = 1L;

	public Entity2() {
	}

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	private String name;
 
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String param) {
		this.name = param;
	}

}