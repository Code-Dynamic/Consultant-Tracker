import java.util.concurrent.TimeUnit;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.net.ssl.HttpsURLConnection;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;

public class Consultants{
	
	public static void main(String[] args) throws Exception {
		/*System.out.println("==> Creating Dummy Consultants...");
		try{
			TimeUnit.SECONDS.sleep(1);
		}catch(InterruptedException e){
			System.out.println("...");
		}
		System.out.println("==> Dummy Consultants Created...");	*/
		String USER_AGENT = "Mozilla/5.0";
		Consultants http = new Consultants();
		String url = "http://localhost:8080/Consultant-Tracker/emplist.svc/Consultants?$format=json";
		
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// optional default is GET
		con.setRequestMethod("GET");

		//add request header
		con.setRequestProperty("User-Agent", USER_AGENT);
	
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);
		
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		//print result
		// System.out.println(response.toString());
		JSONParser parser = new JSONParser();
        Object obj1 = parser.parse(response.toString());
		JSONObject obj2 = (JSONObject)obj1;
		JSONArray array = (JSONArray)((JSONObject)obj2.get("d")).get("results");

		System.out.println();
        System.out.println("There are "+array.size()+" Consultants read from the database, which include: ");
		System.out.println();
		
		for (int i = 0; i < array.size(); i++) {
			// System.out.println(array.get(i));
			JSONObject jobj = (JSONObject)array.get(i);

			System.out.print((i+1)+". Consultant_Surname: "+jobj.get("Consultant_Surname"));
			System.out.print("| Consultant_email: "+jobj.get("Consultant_email"));
			System.out.print("| Consultant_Admin: "+jobj.get("Consultant_Admin"));
			System.out.print("| Consultant_Cell: "+jobj.get("Consultant_Cell"));
			System.out.print("| Consultant_ID: "+jobj.get("Consultant_ID"));
			System.out.println("| Consultant_Name: "+jobj.get("Consultant_Name"));

			if(i != array.size()-1)
				System.out.println();
		}
	}
}