package taskapp.Controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import taskapp.Entitiy.User;
import taskapp.Repository.UserRepository;

@Controller
public class HomeController {

    private final UserRepository theUserRepository;

    public HomeController(UserRepository theUserRepository) {
        this.theUserRepository = theUserRepository;
    }

    @GetMapping("/")
    public String welcome(Model model) {
        List<User> users = theUserRepository.findAll();
        model.addAttribute("users", users);
        return "welcome";
    }

}
