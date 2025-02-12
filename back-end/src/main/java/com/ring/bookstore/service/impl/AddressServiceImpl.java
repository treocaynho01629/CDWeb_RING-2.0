package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.accounts.AddressDTO;
import com.ring.bookstore.dtos.mappers.AddressMapper;
import com.ring.bookstore.dtos.accounts.IAddress;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.model.Address;
import com.ring.bookstore.repository.AccountProfileRepository;
import com.ring.bookstore.repository.AddressRepository;
import com.ring.bookstore.request.AddressRequest;
import com.ring.bookstore.service.AddressService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepo;
    private final AccountProfileRepository profileRepo;
    private final AddressMapper addressMapper;

    @Override
    public List<AddressDTO> getMyAddresses(Account user) {
        List<IAddress> addresses = addressRepo.findAddressesByProfile(user.getProfile().getId());
        List<AddressDTO> addressDTOS = addresses.stream().map(addressMapper::projectionToDTO).toList();
        return addressDTOS;
    }

    @Override
    public AddressDTO getMyAddress(Account user) {
        IAddress address = addressRepo.findAddressByProfile(user.getProfile().getId());
        return addressMapper.projectionToDTO(address);
    }

    @Override
    public Address getAddress(Long id) {
        Address address = addressRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Address not found!"));
        return address;
    }

    @Transactional
    public Address addAddress(AddressRequest request, Account user) {
        AccountProfile profile = profileRepo.findById(user.getProfile().getId()).orElseThrow(()
                -> new ResourceNotFoundException("Profile not found!"));

        //Limit size
        int MAX_SIZE = 5;
        int currSize = profile.getAddresses() != null ? profile.getAddresses().size() : 0;
        if (currSize >= MAX_SIZE) {
            throw new HttpResponseException(HttpStatus.CONFLICT, "Can not add more than 5 addresses!");
        }

        //Create address
        var address = Address.builder()
                .name(request.getName())
                .companyName(request.getCompanyName())
                .phone(request.getPhone())
                .city(request.getCity())
                .address(request.getAddress())
                .type(request.getType())
                .profile(profile)
                .build();

        Address savedAddress = addressRepo.save(address); //Save address

        //Default address
        if (request.getIsDefault() || currSize == 0) { profile.setAddress(savedAddress);}

        profileRepo.save(profile); //Save profile
        return savedAddress;
    }

    @Transactional
    public Address updateAddress(AddressRequest request, Long id, Account user) {
        Address address = addressRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Address not found!"));
        AccountProfile profile = user.getProfile();
        if (profile == null || !address.getProfile().getId().equals(profile.getId())) {
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid user!");
        }

        //Update
        address.setName(request.getName());
        address.setCompanyName(request.getCompanyName());
        address.setPhone(request.getPhone());
        address.setCity(request.getCity());
        address.setAddress(request.getAddress());
        address.setType(request.getType());

        //Save
        Address updatedAddress = addressRepo.save(address);

        //Default address
        if (request.getIsDefault() && !address.getIsDefault()) {
            AccountProfile currProfile = address.getProfile();

            //Set new default
            currProfile.setAddress(address);
            profileRepo.save(currProfile); //Save profile
        }

        return updatedAddress;
    }

    @Transactional
    public Address deleteAddress(Long id, Account user) {
        Address address = addressRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Address not found!"));

        if (!address.getProfile().getId().equals(user.getProfile().getId())) {
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid user!");
        }

        addressRepo.deleteById(id); //Delete from database
        return address;
    }
}
