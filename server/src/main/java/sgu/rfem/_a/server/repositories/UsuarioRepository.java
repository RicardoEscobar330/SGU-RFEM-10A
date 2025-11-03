package sgu.rfem._a.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sgu.rfem._a.server.models.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
}
