package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ConsultantCases {
	public static void testCases(WebDriver driver) throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		// Consultant Test Cases
		// Consultant Test Case 1: Utilization Dates
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter3"))).click();
		Thread.sleep(1000);
		//Tatenda
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--consultantObjectListItem-__component0---MasterAdmin--consultants-0-content"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--iconTabBarFilter2"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--utilizationMonthSelect-label"))).click();
		Thread.sleep(700);
		//Stephen
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--consultantObjectListItem-__component0---MasterAdmin--consultants-1-content"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--iconTabBarFilter2"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--utilizationMonthSelect-label"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--month2"))).click();
		Thread.sleep(2000);
		
		
		/*List<WebElement> allElements = driver.findElements(By.xpath("//div[@id='__component0---MasterAdmin--projectsList-listUl']/ul")); 
		System.out.println(allElements.size());*/
		/*List<WebElement> optionCount = driver.findElements(By.xpath("//select/option"));
		System.out.println(optionCount.size());*/
		/*js.executeScript("alert('Project Test Case 1: Creating Project')");
		Thread.sleep(1000);
		driver.switchTo().alert().dismiss();*/
//			driver.findElement(By.id("p_Name")).sendKeys("Name");
//			wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--rateTeamBtn"))).click();
		/*driver.findElement(By.id("__component0---LoginView--username-email-inner")).sendKeys("zzz@blah.co.za");
			Thread.sleep(1000);
			driver.findElement(By.id("__component0---LoginView--password-inner")).sendKeys("zzz");
//			System.out.println(driver.findElement(By.id("__item4-masterPage--orders-0")).getText());
			Thread.sleep(1000);
			driver.findElement(By.id("__button0")).click();
			Thread.sleep(2000);*/
		
		// Go to Consultants Tab
		/*driver.findElement(By.id("__component0---MasterAdmin--iconTabBarFilter3")).click();
			Thread.sleep(1000);
			wait.until(ExpectedConditions.elementToBeClickable(By.id("__item6-__component0---MasterAdmin--consultants-0"))).click();
//			driver.findElement(By.id("__item6-__component0---MasterAdmin--consultants-0")).click();
			Thread.sleep(1000);*/
		
//			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--DetailConsultantView-title-inner"))).click();
		/*wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--iconTabBarFilter2"))).click();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--iconTabBarFilter3"))).click();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("__component0---DetailConsultantView--iconTabBarFilter4"))).click();*/
//			driver.findElement(By.id("__component0---DetailConsultantView--DetailConsultantView-title-inner")).sendKeys("Consultant Details");
//			element.click();
//			Thread.sleep(1000);
		// Go back to Projects Tab
//			driver.findElement(By.id("__component0---MasterAdmin--iconTabBarFilter2")).click();
//			Thread.sleep(2000);
//			driver.findElement(By.id("__item5-__component0---MasterAdmin--projects-0")).click();
		
//			driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter1")).click();//Project Data
//			driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter2")).click();//Members
//			driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter3")).click();//Tasks
//			driver.findElement(By.id("__component0---DetailAdmin--iconTabBarFilter4")).click();//Attachments
	}
}
