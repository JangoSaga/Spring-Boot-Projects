package taskapp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import taskapp.Entitiy.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
