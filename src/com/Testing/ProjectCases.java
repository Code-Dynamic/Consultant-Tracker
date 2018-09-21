package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ProjectCases {
	public static void testCases(WebDriver driver) throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		Actions action = new Actions(driver);
		
		//Show Map Of Client
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter5"))).click();
		
		/*//Add Clients Via CSV
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--popover_buttonId"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("addClientButton"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("csvUploader-fu"))).sendKeys("C:\\Users\\hulis\\Desktop\\clients.csv");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("clientUploadButton"))).click();
		
		
		//Add Consultants Via CSV
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--popover_buttonId"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("addConsultantButton"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("csvUploader-fu"))).sendKeys("C:\\Users\\hulis\\Desktop\\consultants.csv");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("consultantUploadButton"))).click();
		
		
		
		//Add Projects Via CSV
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--popover_buttonId"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("addProjectButton"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("csvUploader-fu"))).sendKeys("C:\\Users\\hulis\\Desktop\\projects.csv");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("projectUploadButton"))).click();
		Thread.sleep(500);
		driver.navigate().refresh();
		*/
		
		// Project Test Case 1: Create Project
		/*wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter2"))).click();
		js.executeScript("alert('Project Test Case 1: Creating Project')");
		Thread.sleep(1500);
		driver.switchTo().alert().dismiss();
		//driver.findElement(By.id("__component0---MasterAdmin--iconTabBarFilter2")).click();
		Thread.sleep(500);
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--addProjectButton"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_Name-inner"))).sendKeys("Selenium Testing Project");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_Description-inner"))).sendKeys("Selenium Testing Project is a dummy project");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_StartDate-inner"))).sendKeys("2018-07-20");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_Deadline-inner"))).sendKeys("2018-07-30");
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("p_OnSite-CbBg"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("submitProjectButton"))).click();
		
		Thread.sleep(1500);
		driver.navigate().refresh();*/
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter3"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter2"))).click();
		
		//Select 2nd Project
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--projectObjectListItem-__component0---MasterAdmin--projectsList-1-content"))).click();
		Thread.sleep(800);
		//Select Dashboard
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter1"))).click();
		Thread.sleep(1500);
		
		//Select Consultants on Project
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--2"))).click();
		Thread.sleep(1500);
		//Select Add Team Member and add 2nd and 4th consultant
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--add_team_member"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item5-__clone1-selectMulti-CbBg"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item5-__clone4-selectMulti-CbBg"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__dialog0-cancel"))).click();
		Thread.sleep(1500);
		
		//Select Tasks
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter3"))).click();
		Thread.sleep(1500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--addActivityButton-__component0---DetailAdmin--idTasksTable-0"))).click();
		Thread.sleep(1500);
		//Fill add activity to task
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_Description-inner"))).sendKeys("Pay the person for food ");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_dateAssigned-inner"))).sendKeys("2018-07-20");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_Deadline-inner"))).sendKeys("2018-07-20");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("allocatedHours-inner"))).sendKeys("03");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeActivityFrag"))).sendKeys("03");
		Thread.sleep(800);	
		action.sendKeys(Keys.ESCAPE).perform();
//		__item1-__component0---DetailAdmin--idTasksTable-0-sub
		/*Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item1-__component0---DetailAdmin--idTasksTable-0-sub"))).click();
		Thread.sleep(800);
//		closeAssignedTasks
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeAssignedTasks"))).click();
		Thread.sleep(800);*/
	}
}
