package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SeleniumTest {
	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver","C:\\Users\\hulis\\Downloads\\Compressed\\Testing\\chromedriver_win32\\chromedriver.exe");
		WebDriver driver = new ChromeDriver();
		WebDriverWait wait = new WebDriverWait(driver, 10);
		JavascriptExecutor js = (JavascriptExecutor) driver;

//		driver.get("http://localhost:8080/Consultant-Tracker/#/MasterAdmin/1052");

		driver.get("http://localhost:8080/Consultant-Tracker/");
		
		// Login Test Cases
		// Login Test Case 1
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
		js.executeScript("alert('Login Test Case 1: Incorrect username and Incorrect password fail')");
		Thread.sleep(1000);
		driver.switchTo().alert().dismiss();
		
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("zzzz@blah.co.za");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("zzz");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__button0"))).click();
		Thread.sleep(200);
		
		
		// Login Test Case 2
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
		js.executeScript("alert('Login Test Case 2: Correct username and Incorrect password fail')");
		Thread.sleep(1000);
		driver.switchTo().alert().dismiss();
		
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("huli2@blah.co.za");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("zzz");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__button0"))).click();
		Thread.sleep(200);
		
		
		// Login Test Case 3
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
		js.executeScript("alert('Login Test Case 3: Incorrect username and Correct fail')");
		Thread.sleep(1000);
		driver.switchTo().alert().dismiss();
		
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("zzz@blah.co.za");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("huli");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__button0"))).click();
		Thread.sleep(200);
		
		
		// Login Test Case 4
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
		js.executeScript("alert('Login Test Case 4: Correct username and Correct password pass')");
		Thread.sleep(1000);
		driver.switchTo().alert().dismiss();
		
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("huli@blah.co.za");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("huli");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__button0"))).click();
		Thread.sleep(200);
		
		
		// Project Test Cases
		// Project Test Case 1
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter3"))).click();
		driver.findElement(By.id("__component0---MasterAdmin--iconTabBarFilter2")).click();
		Thread.sleep(1000);
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__button9"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_Name-inner"))).sendKeys("Selenium Testing Project");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_Description-inner"))).sendKeys("Selenium Testing Project is a dummy project");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_StartDate-inner"))).sendKeys("20 July 2018");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_Deadline-inner"))).sendKeys("30 July 2018");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_OnSite-CbBg"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__button14"))).click();
//		driver.findElement(By.id("p_Name")).sendKeys("Name");
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_Name"))).sendKeys("Name");
		/*driver.findElement(By.id("__component0---LoginView--username-email-inner")).sendKeys("zzz@blah.co.za");
		Thread.sleep(1000);
		driver.findElement(By.id("__component0---LoginView--password-inner")).sendKeys("zzz");
//		System.out.println(driver.findElement(By.id("__item4-masterPage--orders-0")).getText());
		Thread.sleep(1000);
		driver.findElement(By.id("__button0")).click();
		Thread.sleep(2000);*/
		
		// Go to Consultants Tab
		/*driver.findElement(By.id("__component0---MasterAdmin--iconTabBarFilter3")).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item6-__component0---MasterAdmin--consultants-0"))).click();
//		driver.findElement(By.id("__item6-__component0---MasterAdmin--consultants-0")).click();
		Thread.sleep(1000);*/
		
//		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--DetailConsultantView-title-inner"))).click();
		/*wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--iconTabBarFilter2"))).click();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--iconTabBarFilter3"))).click();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--iconTabBarFilter4"))).click();*/
//		driver.findElement(By.id("__component0---DetailConsultantView--DetailConsultantView-title-inner")).sendKeys("Consultant Details");
//		element.click();
//		Thread.sleep(1000);
		// Go back to Projects Tab
//		driver.findElement(By.id("__component0---MasterAdmin--iconTabBarFilter2")).click();
//		Thread.sleep(2000);
//		driver.findElement(By.id("__item5-__component0---MasterAdmin--projects-0")).click();
		
//		driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter1")).click();//Project Data
//		driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter2")).click();//Members
//		driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter3")).click();//Tasks
//		driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter4")).click();//Attachments
//		driver.close();
		
		
		
		/*driver.get("https://cs.up.ac.za/undergrad");
		driver.findElement(By.linkText("Login")).click();*/
		/*WebDriver driver = new ChromeDriver();
		driver.get("google.com");*/
	}
}
