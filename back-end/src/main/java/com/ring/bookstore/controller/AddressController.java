package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.dto.response.accounts.AddressDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.dto.request.AddressRequest;
import com.ring.bookstore.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller named {@link AddressController} for handling address-related operations.
 * Exposes endpoints under "/api/addresses".
 */
@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Validated
public class AddressController {

    private final AddressService addressService;

    /**
     * Retrieves user's default address.
     *
     * @param currUser the currently authenticated user.
     * @return a {@link ResponseEntity} containing the address.
     */
    @GetMapping
    public ResponseEntity<?> getAddress(@CurrentAccount Account currUser) {
        AddressDTO address = addressService.getMyAddress(currUser);
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    /**
     * Retrieves all user's addresses.
     *
     * @param currUser the currently authenticated user.
     * @return a {@link ResponseEntity} containing a list of addresses.
     */
    @GetMapping("/saved")
    @PreAuthorize("hasRole('USER') and hasAuthority('read:address')")
    public ResponseEntity<?> getProfileAddresses(@CurrentAccount Account currUser) {
        List<AddressDTO> addresses = addressService.getMyAddresses(currUser);
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    /**
     * Retrieves an address by its ID.
     *
     * @param id the ID of the address to retrieve.
     * @return a {@link ResponseEntity} containing the address.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('read:address')")
    public ResponseEntity<?> getAddressById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(addressService.getAddress(id), HttpStatus.OK);
    }

    /**
     * Creates a new address.
     *
     * @param request the address creation details.
     * @param currUser the currently authenticated user.
     * @return a {@link ResponseEntity} containing the created address.
     */
    @PostMapping()
    @PreAuthorize("hasRole('USER') and hasAuthority('create:address')")
    public ResponseEntity<?> addAddress(@Valid @RequestBody AddressRequest request,
                                     @CurrentAccount Account currUser) {
        return new ResponseEntity<>(addressService.addAddress(request, currUser), HttpStatus.CREATED);
    }

    /**
     * Updates an existing address by its ID.
     *
     * @param id the ID of the address to update.
     * @param request the address update details.
     * @param currUser the currently authenticated user.
     * @return a {@link ResponseEntity} containing the updated address.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') and hasAuthority('update:address')")
    public ResponseEntity<?> updateAddress(@PathVariable("id") Long id,
                                        @Valid @RequestBody AddressRequest request,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(addressService.updateAddress(request, id, currUser), HttpStatus.CREATED);
    }

    /**
     * Deletes an address by its ID.
     *
     * @param id the ID of the address to delete.
     * @return a {@link ResponseEntity} containing the deleted address.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') and hasAuthority('delete:address')")
    public ResponseEntity<?> deleteAddress(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(addressService.deleteAddress(id, currUser), HttpStatus.OK);
    }
}
