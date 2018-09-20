package com.Testing;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Map_CSV_Demo {
	public static void main(String[] args) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver","C:\\Users\\hulis\\Downloads\\Compressed\\Testing\\chromedriver_win32\\chromedriver.exe");
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--start-maximized");
		
		WebDriver driver = new ChromeDriver(options);
		driver.get("http://localhost:8080/Consultant-Tracker/#/MasterAdmin/1435");
		Actions action = new Actions(driver);
		WebDriverWait wait = new WebDriverWait(driver, 10);
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		//Show Map Of Client
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--iconTabBarFilter5"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("__component0---DetailAdmin--show_hide_route_button"))).click();
		Thread.sleep(2000);
		
		//Add Clients Via CSV
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
	}
}
