package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class UserCases {
	public static void testCases(WebDriver driver) throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		// User Test Cases
	/*	// User Test Case 1: Time
		js.executeScript("alert('Test Case 2: Time Entering')");
		Thread.sleep(1700);
		driver.switchTo().alert().dismiss();
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--requestUserTimesBtn"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("tpGeneral-inner"))).sendKeys("08:00");
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--submitUserTimesBtn"))).click();*/
		
		// User Test Case 2: Ratings
		js.executeScript("alert('Test Case 2: Ratings')");
		Thread.sleep(2000);
		driver.switchTo().alert().dismiss();
//					driver.findElement(By.id("__item2-__component0---MasterAdmin--projectsList-1")).click();
		Thread.sleep(1700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__item2-__component0---MasterAdmin--projectsList-1"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--rateTeamBtn"))).click();
		Thread.sleep(700);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--submitRatesButton"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--closeRatesButton"))).click();

	}
}
