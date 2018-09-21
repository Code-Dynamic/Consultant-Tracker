package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CSV_TestingCases {
	public static void testCases(WebDriver driver) throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(driver, 20);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		//Add Clients Via CSV
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--popover_buttonId"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("addClientButton"))).click();
		Thread.sleep(500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("csvUploader-fu"))).sendKeys("C:\\COS301-Testing\\clients.csv");
		Thread.sleep(500);
//				wait.until(ExpectedConditions.elementToBeClickable(By.id("clientUploadButton"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeClientModalButton"))).click();
	}
}
