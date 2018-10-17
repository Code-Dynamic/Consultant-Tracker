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
		//Sally
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--consultantObjectListItem-__component0---MasterAdmin--consultants-0-content"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--iconTabBarFilter2"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--utilizationMonthSelect-label"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--month8"))).click();
		Thread.sleep(1000);
		//Sandy
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--consultantObjectListItem-__component0---MasterAdmin--consultants-1-content"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--iconTabBarFilter1"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--iconTabBarFilter2"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--utilizationMonthSelect-label"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailConsultantView--month9"))).click();
		Thread.sleep(1000);
		
		//Rate
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--iconTabBarFilter2"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--rateTeamBtn"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--closeRatesButton"))).click();
		Thread.sleep(1000);
	}
}
