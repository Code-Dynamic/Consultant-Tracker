import java.util.concurrent.TimeUnit;

public class Test3{
	public static void main(String[] args) {
		System.out.println("==> Removing Dummy Consultant from Dummy Project...");
		try{
			TimeUnit.SECONDS.sleep(1);
		}catch(InterruptedException e){
			System.out.println("...");
		}
		// System.out.println("==> Dummy Consultant Removed...");	
		System.out.println("==> Nothing happened because there was no consultant tracked...");	
	}
}