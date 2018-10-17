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
		
		Thread.sleep(1500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter3"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter2"))).click();
		
		//Select 2nd Project
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--projectObjectListItem-__component0---MasterAdmin--projectsList-2-content"))).click();
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
		wait.until(ExpectedConditions.elementToBeClickable(By.id("list_item-__clone12-selectMulti-CbBg"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("list_item-__clone17-selectMulti-CbBg"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("list-cancel"))).click();
		Thread.sleep(1500);
		
		//Select Tasks
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter3"))).click();
		Thread.sleep(1500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--addActivityButton-__component0---DetailAdmin--idTasksTable-0"))).click();
		Thread.sleep(1500);
		//Fill add activity to task
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_Description-inner"))).sendKeys("Alpha testing the User Interface");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_dateAssigned-inner"))).sendKeys("2018-09-05");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("AT_Deadline-inner"))).sendKeys("2018-09-20");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("allocatedHours-inner"))).sendKeys("150");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeActivityFrag"))).click();
		Thread.sleep(1000);
//		action.sendKeys(Keys.ESCAPE).perform();
		
		//Client Tab
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter6"))).click();
		Thread.sleep(2500);
		
		//Map Tab
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter5"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2500);
		
		//Mark Project as Done
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--onMarkProjectCompletedBtn"))).click();
		
		//Edit Project Details
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--editProject"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("EditP_Description-inner"))).sendKeys("Empoloyee times system for the volkswagen time system industry. Which enhances proper things.");
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("EP_closeProjectModalButton"))).click();
		Thread.sleep(2000);
		
		//Search Project
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--projectSearchField-I"))).sendKeys("inv");
		Thread.sleep(1000);

	}
}
