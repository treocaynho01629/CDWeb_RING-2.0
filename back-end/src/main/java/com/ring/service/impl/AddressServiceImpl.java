package com.ring.service.impl;

import com.ring.dto.projection.accounts.IAddress;
import com.ring.dto.request.AddressRequest;
import com.ring.dto.response.accounts.AddressDTO;
import com.ring.exception.EntityOwnershipException;
import com.ring.exception.HttpResponseException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.mapper.AddressMapper;
import com.ring.model.entity.Account;
import com.ring.model.entity.AccountProfile;
import com.ring.model.entity.Address;
import com.ring.repository.AccountProfileRepository;
import com.ring.repository.AddressRepository;
import com.ring.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepo;
    private final AccountProfileRepository profileRepo;
    private final AddressMapper addressMapper;

    @Cacheable(cacheNames = "addresses", key = "#user.id")
    public List<AddressDTO> getMyAddresses(Account user) {
        List<IAddress> addresses = addressRepo.findAddressesByProfile(user.getProfile().getId());
        List<AddressDTO> addressDTOS = addresses.stream().map(addressMapper::projectionToDTO).toList();
        return addressDTOS;
    }

    @Cacheable(cacheNames = "userAddress", key = "#user.id")
    public AddressDTO getMyAddress(Account user) {
        IAddress address = addressRepo.findAddressByProfile(user.getProfile().getId());
        return addressMapper.projectionToDTO(address);
    }

    @Cacheable(cacheNames = "address", key = "#id")
    public Address getAddress(Long id) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found!",
                        "Không tìm thấy địa chỉ yêu cầu!"));
        return address;
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "addresses", "userAddress" }, key = "#user.id") }, put = {
            @CachePut(cacheNames = "address", key = "#result.id", condition = "#result != null") })
    @Transactional
    public Address addAddress(AddressRequest request, Account user) {
        AccountProfile profile = profileRepo.findById(user.getProfile().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found!",
                        "Không tìm thấy hồ sơ yêu cầu!"));

        // Limit size
        int MAX_SIZE = 5;
        int currSize = profile.getAddresses() != null ? profile.getAddresses().size() : 0;
        if (currSize >= MAX_SIZE) {
            throw new HttpResponseException(HttpStatus.CONFLICT, "Can not add more than 5 addresses!");
        }

        // Create address
        var address = Address.builder()
                .name(request.getName())
                .companyName(request.getCompanyName())
                .phone(request.getPhone())
                .city(request.getCity())
                .address(request.getAddress())
                .type(request.getType())
                .profile(profile)
                .build();

        Address savedAddress = addressRepo.save(address); // Save address

        // Default address
        if (request.getIsDefault() || currSize == 0) {
            profile.setAddress(savedAddress);
        }

        profileRepo.save(profile); // Save profile
        return savedAddress;
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "addresses", "userAddress" }, key = "#user.id") }, put = {
            @CachePut(cacheNames = "address", key = "#id", condition = "#result != null") })
    @Transactional
    public Address updateAddress(AddressRequest request, Long id, Account user) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found!",
                        "Không tìm thấy địa chỉ yêu cầu!"));
        AccountProfile profile = user.getProfile();
        if (profile == null || !address.getProfile().getId().equals(profile.getId())) {
            throw new EntityOwnershipException("Invalid user!",
                    "Người dùng không có quyền chỉnh sửa hồ sơ này!");
        }

        // Update
        address.setName(request.getName());
        address.setCompanyName(request.getCompanyName());
        address.setPhone(request.getPhone());
        address.setCity(request.getCity());
        address.setAddress(request.getAddress());
        address.setType(request.getType());

        // Save
        Address updatedAddress = addressRepo.save(address);

        // Default address
        if (request.getIsDefault() && !address.getIsDefault()) {
            AccountProfile currProfile = address.getProfile();

            // Set new default
            currProfile.setAddress(address);
            profileRepo.save(currProfile); // Save profile
        }

        return updatedAddress;
    }

    @Caching(evict = { @CacheEvict(cacheNames = "address", key = "#id"),
            @CacheEvict(cacheNames = "userAddress", key = "#user.id"),
            @CacheEvict(cacheNames = "addresses", key = "#user.id") })
    @Transactional
    public Address deleteAddress(Long id, Account user) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found!",
                        "Không tìm thấy địa chỉ yêu cầu!"));

        if (!address.getProfile().getId().equals(user.getProfile().getId())) {
            throw new EntityOwnershipException("Invalid user!",
                    "Người dùng không có quyền chỉnh sửa địa chỉ này!");
        }

        addressRepo.deleteById(id); // Delete from database
        return address;
    }
}
