package org.persistence;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;

@Entity
@NamedQuery(name = "allEntity1s", query = "select e from Entity1 e join Entity2 e2 on e.entity2=e2.id")
public class Entity1 implements Serializable {

	private static final long serialVersionUID = 1L;

	public Entity1() {
	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	private Entity2 entity2;
	public long getId() {
		return id; 
	}

	public void setId(long id) {
		this.id = id;
	}

	public Entity2 getEntity2() {
		return entity2;
	}

	public void setEntity2(Entity2 param) {
		this.entity2 = param;
	}

}