package com.slotegrator.lt.generator;

import com.slotegrator.lt.model.User;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class UserGeneratorImpl implements UserGenerator{

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final String PASSWD = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_=+1234567890";

    @Override
    public void run(int usersCount) {
        writeToCSV(getDummyUsersList(usersCount), "test.csv");
    }

    private List<User> getDummyUsersList(int usersCount) {
        System.out.println("Starting generate data");
        return IntStream.range(0, usersCount)
                .mapToObj(i -> createUser())
                .collect(Collectors.toList());
    }

    private User createUser() {
        String password = generatePasswd();
        return new User("USD"
                , generateEmail()
                , generateName()
                , password
                , password
                , generateName()
                , generateName());
    }

    private String generateEmail() {
        return generateRandomString(10, CHARACTERS).concat("@mail.com");
    }

    private String generateName() {
        return generateRandomString(12, CHARACTERS);
    }

    private String generatePasswd() {
        return generateRandomString(16, PASSWD);
    }

    private String generateRandomString(int length, String template) {
        Random random = new Random();
        int templateLength = template.length();
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(templateLength);
            char randomChar = template.charAt(randomIndex);
            sb.append(randomChar);
        }

        return sb.toString();
    }

    private void writeToCSV(List<User> userList, String filePath) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath))) {
            StringBuilder sb = new StringBuilder();

            sb.append("currency_code, email, name, password_change, password_repeat, surname, username")
                    .append(System.lineSeparator());

            for (User user : userList) {
                sb.append(user.getCurrencyCode()).append(",");
                sb.append(user.getEmail()).append(",");
                sb.append(user.getName()).append(",");
                sb.append(user.getPasswordChange()).append(",");
                sb.append(user.getPasswordRepeat()).append(",");
                sb.append(user.getSurname()).append(",");
                sb.append(user.getUsername()).append(System.lineSeparator());
            }

            bw.write(sb.toString());

            System.out.println("CSV file has been created successfully.");
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
