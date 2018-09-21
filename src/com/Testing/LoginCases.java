package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginCases {

	public static void testCases(WebDriver driver) throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(driver, 20);
		JavascriptExecutor js = (JavascriptExecutor) driver;
	
		/*// Login Test Case 1
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
		js.executeScript("alert('Login Test Case 1: Incorrect username and Incorrect password fail')");
		Thread.sleep(1500);
		driver.switchTo().alert().dismiss();
		
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("zzzz@blah.co.za");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("zzz");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--loginButton"))).click();
		Thread.sleep(200);
		
		
		// Login Test Case 2
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
		js.executeScript("alert('Login Test Case 2: Correct username and Incorrect password fail')");
		Thread.sleep(1500);
		driver.switchTo().alert().dismiss();
		
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("huli2@blah.co.za");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("zzz");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--loginButton"))).click();
		Thread.sleep(200);
		
		
		// Login Test Case 3
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
		js.executeScript("alert('Login Test Case 3: Incorrect username and Correct fail')");
		Thread.sleep(1500);
		driver.switchTo().alert().dismiss();
		
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("zzz@blah.co.za");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("huli");
		Thread.sleep(200);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--loginButton"))).click();
		Thread.sleep(200);*/
		
		
		// Login Test Case 4
		
//		Thread.sleep(200);
		
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).clear();
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).clear();
//		js.executeScript("alert('Login Test Case 4: Correct username and Correct password pass')");
//		Thread.sleep(1500);
//		driver.switchTo().alert().dismiss();
		
		Thread.sleep(4000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--username-email-inner"))).sendKeys("Superuser");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--password-inner"))).sendKeys("CodeDynamicTesting");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---LoginView--loginButton"))).click();
		Thread.sleep(500);
	}
}
