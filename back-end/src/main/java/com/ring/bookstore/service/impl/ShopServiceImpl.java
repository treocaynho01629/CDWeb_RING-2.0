package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.shops.ShopDTO;
import com.ring.bookstore.dtos.mappers.ShopMapper;
import com.ring.bookstore.dtos.shops.IShopDetail;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.repository.AddressRepository;
import com.ring.bookstore.repository.ShopRepository;
import com.ring.bookstore.request.AddressRequest;
import com.ring.bookstore.request.ShopRequest;
import com.ring.bookstore.service.ImageService;
import com.ring.bookstore.service.ShopService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepo;
    private final AccountRepository accountRepo;
    private final AddressRepository addressRepo;
    private final ShopMapper shopMapper;
    private final ImageService imageService;

    @Override
    public Page<ShopDTO> getShops(Integer pageNo, Integer pageSize, String sortBy, String sortDir, String keyword, Long ownerId) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Fetch from database
        Page<IShopDetail> shopsList = shopRepo.findShopByFilter(keyword, ownerId, pageable);
        Page<ShopDTO> shopDTOS = shopsList.map(shopMapper::apply);
        return shopDTOS;
    }

    @Override
    public ShopDTO getShopById(Long id, Account user) {
        Long userId = user != null ? user.getId() : null;
        IShopDetail shop = shopRepo.findShopById(id, userId).orElseThrow(() ->
                new ResourceNotFoundException("Shop not found!"));
        ShopDTO shopDTO = shopMapper.apply(shop); //Map to DTO
        return shopDTO;
    }

    @Transactional
    public void follow(Long id, Account user) {
        Shop shop = shopRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Shop not found"));
        Account currUser = accountRepo.findByUsername(user.getUsername()).orElseThrow(() ->
                new ResourceNotFoundException("User not found"));
        shop.addFollower(currUser);
        shopRepo.save(shop);
    }

    @Transactional
    public void unfollow(Long id, Account user) {
        Shop shop = shopRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Shop not found"));
        shop.removeFollower(user);
        shopRepo.save(shop);
    }

    //Add shop (SELLER)
    @Transactional
    public Shop addShop(ShopRequest request, MultipartFile file, Account user) throws IOException, ImageResizerException {
        Image image = null;

        //Image upload
        if (file != null) image = imageService.upload(file);

        //Create address
        AddressRequest addressRequest = request.getAddressRequest();
        var address = Address.builder()
                .name(addressRequest.getName())
                .companyName(addressRequest.getCompanyName())
                .phone(addressRequest.getPhone())
                .city(addressRequest.getCity())
                .address(addressRequest.getAddress())
                .type(addressRequest.getType())
                .build();

        Address savedAddress = addressRepo.save(address); //Save address

        //Create new shop
        var shop = Shop.builder()
                .name(request.getName())
                .description(request.getDescription())
                .image(image)
                .owner(user)
                .address(savedAddress)
                .build();
        Shop addedShop = shopRepo.save(shop); //Save to database
        return addedShop;
    }

    @Transactional
    public Shop updateShop(Long id, ShopRequest request, MultipartFile file, Account user) throws IOException, ImageResizerException {
        //Get original shop
        Shop shop = shopRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Shop not found"));

        //Check if correct seller or admin
        if (!isOwnerValid(shop, user)) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        //Image upload/replace
        if (file != null) { //Contain new image >> upload/replace
            Long imageId = shop.getImage().getId();
            if (imageId != null) imageService.deleteImage(imageId); //Delete old image

            Image savedImage = imageService.upload(file); //Upload new image
            shop.setImage(savedImage); //Set new image
        }

        //Update address
        AddressRequest addressRequest = request.getAddressRequest();
        Address address = shop.getAddress();

        address.setName(addressRequest.getName());
        address.setCompanyName(addressRequest.getCompanyName());
        address.setPhone(addressRequest.getPhone());
        address.setCity(addressRequest.getCity());
        address.setAddress(addressRequest.getAddress());
        address.setType(addressRequest.getType());

        Address updatedAddress = addressRepo.save(address); //Save address

        shop.setAddress(updatedAddress);
        shop.setName(request.getName());
        shop.setDescription(request.getDescription());

        //Update
        Shop updatedShop = shopRepo.save(shop);
        return updatedShop;
    }

    @Override
    public Shop deleteShop(Long id, Account user) {
        Shop shop = shopRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Shop not found"));
        //Check if correct seller or admin
        if (!isOwnerValid(shop, user)) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        shopRepo.deleteById(id); //Delete from database
        return shop;
    }

    @Transactional
    public void deleteShops(String keyword, Long ownerId, List<Long> ids, Boolean isInverse, Account user) {
        List<Long> listDelete = ids;
        if (isInverse) listDelete = shopRepo.findInverseIds(keyword, ownerId, ids);

        //Loop and delete
        for (Long id : listDelete) {
            Shop shop = shopRepo.findById(id).orElseThrow(() ->
                    new ResourceNotFoundException("Shop not found"));
            //Check if correct seller or admin
            if (!isOwnerValid(shop, user)) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");
            shopRepo.deleteById(id); //Delete from database
        }
    }

    @Override
    public void deleteAllShops() {
        shopRepo.deleteAll();
    }

    //Check valid role function
    protected boolean isOwnerValid(Shop shop, Account user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        boolean isAdmin = (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
        //Check if is admin or valid owner id
        return shop.getOwner().getId().equals(user.getId()) || isAdmin;
    }
}
