package com.ConsultantTracker.util;

import java.security.SecureRandom;

public class GeneratePassword {
	private static SecureRandom random = new SecureRandom();

    /** different dictionaries used */
    private static final String ALPHA_CAPS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String ALPHA = "abcdefghijklmnopqrstuvwxyz";
    private static final String NUMERIC = "0123456789";
    private static final String SPECIAL_CHARS = "!@#$%^&*_=+-/";

    /**
     * Method will generate random string based on the parameters
     * 
     * @param len
     *            the length of the random string
     * @return the random password
     */
    public String generatePassword(int length) {
	    String result = "";
	    for (int i = 0; i < length; i++) {
	        int index = random.nextInt((ALPHA_CAPS+ALPHA+NUMERIC+SPECIAL_CHARS).length());
	        result += (ALPHA_CAPS+ALPHA+NUMERIC+SPECIAL_CHARS).charAt(index);
	    }
	    return result;
    }
}
