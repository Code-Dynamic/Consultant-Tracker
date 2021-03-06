package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MapTestingCases {
	public static void testCases(WebDriver driver) throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(driver, 20);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		//Testing project without client assigned
		Thread.sleep(1000);
//		__item2-__component0---MasterAdmin--projectsList-1-content
//		__component0---MasterAdmin--projectObjectListItem-__component0---MasterAdmin--projectsList-0-content
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--projectObjectListItem-__component0---MasterAdmin--projectsList-0-content"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter5"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		
		//Testing project without client assigned
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--projectObjectListItem-__component0---MasterAdmin--projectsList-3-content"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter5"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		
	}
}
