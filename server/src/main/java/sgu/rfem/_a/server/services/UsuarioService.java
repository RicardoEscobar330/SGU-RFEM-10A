package sgu.rfem._a.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sgu.rfem._a.server.models.Usuario;
import sgu.rfem._a.server.repositories.UsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    public List<Usuario> getAll() {
        return repository.findAll();
    }

    public Usuario save(Usuario usuario) {
        return repository.save(usuario);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Usuario update(Long id, Usuario usuario) {
        Optional<Usuario> opt = repository.findById(id);
        if (opt.isPresent()) {
            Usuario existing = opt.get();
            existing.setNombreCompleto(usuario.getNombreCompleto());
            existing.setEmail(usuario.getEmail());
            existing.setTelefono(usuario.getTelefono());
            return repository.save(existing);
        }
        throw new IllegalArgumentException("User with id " + id + " not found");
    }
}
