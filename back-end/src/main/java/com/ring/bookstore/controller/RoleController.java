package com.ring.bookstore.controller;

import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.service.RoleService;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class named {@link RoleController} for handling basic role-privilege-related operations.
 * Exposes endpoints under "/api/roles".
 */
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    /**
     * Retrieves all grouped privileges.
     *
     * @return a {@link ResponseEntity} containing list of grouped privileges.
     */
    @GetMapping("/privileges")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST') and hasAuthority('read:role')")
    public ResponseEntity<?> getPrivileges() {
        return new ResponseEntity<>(roleService.getPrivileges(), HttpStatus.OK);
    }

    /**
     * Retrieves a role by its name.
     *
     * @param name the category name.
     * @return a {@link ResponseEntity} containing the role.
     */
    @GetMapping("/{name}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('read:role')")
    public ResponseEntity<?> getRole(@PathVariable("name") UserRole name) {
        return new ResponseEntity<>(roleService.findRole(name), HttpStatus.OK);
    }

    /**
     * Updates an existing role by its name.
     *
     * @param name          the name of the role to update.
     * @param privileges    the account update privileges.
     * @return a {@link ResponseEntity} containing the success message.
     */
    @PutMapping("/{name}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('update:role')")
    public ResponseEntity<?> updateRole(@PathVariable("name") UserRole name,
                                        @RequestPart
                                        @NotNull(message = "Quyền hạn không được để trống!")
                                        @NotEmpty(message = "Quyền hạn không được để trống!")
                                        List<PrivilegeType> privileges) {
        roleService.updateRole(privileges, name);
        return new ResponseEntity<>("Cập nhật quyền thành công!", HttpStatus.OK);
    }
}
