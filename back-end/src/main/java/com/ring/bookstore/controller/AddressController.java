package com.ring.bookstore.controller;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.dtos.accounts.AddressDTO;
import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.AddressRequest;
import com.ring.bookstore.request.BookRequest;
import com.ring.bookstore.service.AddressService;
import com.ring.bookstore.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Validated
public class AddressController {

    private final AddressService addressService;

    //Get current user's main address
    @GetMapping()
    public ResponseEntity<?> getAddress(@CurrentAccount Account currUser) {
        AddressDTO address = addressService.getMyAddress(currUser);
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    //Get current user's addresses
    @GetMapping("/saved")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> getProfileAddresses(@CurrentAccount Account currUser) {
        List<AddressDTO> addresses = addressService.getMyAddresses(currUser);
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    //Get address by {id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getAddressById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(addressService.getAddress(id), HttpStatus.OK);
    }


    //Add new address
    @PostMapping()
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> addAddress(@Valid @RequestBody AddressRequest request,
                                     @CurrentAccount Account currUser) {
        return new ResponseEntity<>(addressService.addAddress(request, currUser), HttpStatus.CREATED);
    }

    //Update new address
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> updateAddress(@PathVariable("id") Long id,
                                        @Valid @RequestBody AddressRequest request,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(addressService.updateAddress(request, id, currUser), HttpStatus.CREATED);
    }

    //Delete address by {id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> deleteAddress(@PathVariable("id") Long id,
                                        @CurrentAccount Account currUser) {
        return new ResponseEntity<>(addressService.deleteAddress(id, currUser), HttpStatus.OK);
    }
}
