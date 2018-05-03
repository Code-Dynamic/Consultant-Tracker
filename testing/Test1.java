import java.util.concurrent.TimeUnit;

public class Test1{
	public static void main(String[] args) {
		System.out.println("==> Creating Dummy Project...");
		try{
			TimeUnit.SECONDS.sleep(1);
		}catch(InterruptedException e){
			System.out.println("...");
		}
		System.out.println("==> Dummy Project Created...");		
	}
}