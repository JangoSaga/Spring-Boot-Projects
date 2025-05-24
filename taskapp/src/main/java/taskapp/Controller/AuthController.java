package taskapp.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import taskapp.Entitiy.User;
import taskapp.Repository.UserRepository;
import taskapp.utils.Validators;

@Controller
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserRepository theUserRepository;

    public AuthController(UserRepository theUserRepository) {
        this.theUserRepository = theUserRepository;
    }

    @GetMapping("/register")
    public String showRegister(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute("user") User user, Model model, Validators validators) {
        String errorMessage = validators.validatePassword(user.getPassword());
        if (errorMessage != null) {
            model.addAttribute("passwordError", errorMessage);
            return "register";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        theUserRepository.save(user);
        return "redirect:/";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

}
