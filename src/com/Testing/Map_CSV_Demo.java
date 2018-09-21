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

public class Map_CSV_Demo {
	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver","C:\\COS301-Testing\\chromedriver.exe");
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--start-maximized");
		
		WebDriver driver = new ChromeDriver(options);
		driver.get("http://localhost:8080/Consultant-Tracker/#/MasterAdmin/1435");
		Actions action = new Actions(driver);
		WebDriverWait wait = new WebDriverWait(driver, 10);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		//Show Map Of Client
		Thread.sleep(2500);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter5"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2500);
		
		//Add Clients Via CSV
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--popover_buttonId"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("addClientButton"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("csvUploader-fu"))).sendKeys("C:\\COS301-Testing\\clients.csv");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("clientUploadButton"))).click();
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeClientModalButton"))).click();

		//Add Consultants Via CSV
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--popover_buttonId"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("addConsultantButton"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("csvUploader-fu"))).sendKeys("C:\\COS301-Testing\\consultants.csv");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("consultantUploadButton"))).click();
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeConsultantButton"))).click();
		
		//Add Projects Via CSV
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---MasterAdmin--popover_buttonId"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("addProjectButton"))).click();
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("csvUploader-fu"))).sendKeys("C:\\COS301-Testing\\projects.csv");
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("projectUploadButton"))).click();
//		wait.until(ExpectedConditions.elementToBeClickable(By.id("closeProjectModalButton"))).click();
		Thread.sleep(1000);
		driver.navigate().refresh();
		Thread.sleep(5000);
		driver.close();
	}
}
