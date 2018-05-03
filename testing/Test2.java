import java.util.concurrent.TimeUnit;

public class Test2{
	public static void main(String[] args) {
		System.out.println("==> Adding Dummy Consultant to Dummy Project...");
		try{
			TimeUnit.SECONDS.sleep(1);
		}catch(InterruptedException e){
			System.out.println("...");
		}
		System.out.println("==> Dummy Consultant Added...");	
	}
}