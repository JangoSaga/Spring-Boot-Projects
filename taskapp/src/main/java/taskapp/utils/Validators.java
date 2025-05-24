package taskapp.utils;

public class Validators {

    public String validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return "password cannot be blank";
        }

        if (password.length() < 8) {
            return "password must be atleast 8 character long";
        }
        if (!password.matches(".*[!@#$%^&*()].*")) {
            return "password must contain atleast one special character";
        }
        return null;
    }

}
