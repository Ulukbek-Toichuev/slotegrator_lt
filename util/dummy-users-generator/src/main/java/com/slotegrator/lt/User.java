package com.slotegrator.lt.model;

import java.util.Objects;

public class User {

    public User(String currencyCode, String email, String name
            , String passwordChange, String passwordRepeat
            , String surname, String username) {
        this.currencyCode = currencyCode;
        this.email = email;
        this.name = name;
        this.passwordChange = passwordChange;
        this.passwordRepeat = passwordRepeat;
        this.surname = surname;
        this.username = username;
    }

    private String currencyCode;

    private String email;

    private String name;

    private String passwordChange;

    private String passwordRepeat;

    private String surname;

    private String username;

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasswordChange() {
        return passwordChange;
    }

    public void setPasswordChange(String passwordChange) {
        this.passwordChange = passwordChange;
    }

    public String getPasswordRepeat() {
        return passwordRepeat;
    }

    public void setPasswordRepeat(String passwordRepeat) {
        this.passwordRepeat = passwordRepeat;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(currencyCode, user.currencyCode) && Objects.equals(email, user.email)
                && Objects.equals(name, user.name) && Objects.equals(passwordChange, user.passwordChange)
                && Objects.equals(passwordRepeat, user.passwordRepeat) && Objects.equals(surname, user.surname)
                && Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(currencyCode, email, name, passwordChange, passwordRepeat, surname, username);
    }

    @Override
    public String toString() {
        return "User{" +
                "currencyCode='" + currencyCode + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", passwordChange='" + passwordChange + '\'' +
                ", passwordRepeat='" + passwordRepeat + '\'' +
                ", surname='" + surname + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
