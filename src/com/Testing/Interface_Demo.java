package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Interface_Demo {
	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver","C:\\COS301-Testing\\chromedriver.exe");
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--start-maximized");
		
		WebDriver driver = new ChromeDriver(options);
		driver.get("http://localhost:8080/Consultant-Tracker/#/MasterAdmin/1435");
		Actions action = new Actions(driver);
		WebDriverWait wait = new WebDriverWait(driver, 10);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		/*//Select 2nd Project
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item2-__component0---MasterAdmin--projectsList-1-content"))).click();
		Thread.sleep(500);
		//Select Dashboard
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter1"))).click();
		Thread.sleep(1000);
		
		//Select Consultants on Project
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--2"))).click();
		Thread.sleep(1000);
		//Select Add Team Member and add 2nd and 4th consultant
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--add_team_member"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item4-__clone1-selectMulti-CbBg"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item4-__clone4-selectMulti-CbBg"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__dialog0-cancel"))).click();
		Thread.sleep(1000);
		
		//Select Tasks
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter3"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--addActivityButton-__component0---DetailAdmin--idTasksTable-0"))).click();
		Thread.sleep(1000);
		//Fill add activity to task
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_Description-inner"))).sendKeys("Pay the person for food ");
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_dateAssigned-inner"))).sendKeys("2018-07-20");
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_Deadline-inner"))).sendKeys("2018-07-20");
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("allocatedHours-inner"))).sendKeys("03");
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeActivityFrag"))).sendKeys("03");
		Thread.sleep(500);	
		action.sendKeys(Keys.ESCAPE).perform();*/
		
		ProjectCases.testCases(driver);
		ConsultantCases.testCases(driver);
		
		
		driver.close();
		
	}
}
