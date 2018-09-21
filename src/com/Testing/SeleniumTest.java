package com.Testing;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class SeleniumTest {
	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver","C:\\chromedriver.exe");
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--start-maximized");
		
		WebDriver driver = new ChromeDriver(options);
//		driver.get("http://localhost:8080/Consultant-Tracker/");
		driver.get("http://localhost:8080/Consultant-Tracker/#/MasterAdmin/1435");
		driver.navigate().refresh();
			
		((JavascriptExecutor)driver).executeScript("showToast();");
//		LoginCases.testCases(driver);
//		ProjectCases.testCases(driver);
//		UserCases.testCases(driver);
//		ConsultantCases.testCases(driver);		

		driver.close();
	}
}
