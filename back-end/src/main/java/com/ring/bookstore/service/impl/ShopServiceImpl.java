package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.mappers.DashboardMapper;
import com.ring.bookstore.dtos.shops.*;
import com.ring.bookstore.dtos.mappers.ShopMapper;
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
import org.springframework.transaction.annotation.Transactional;
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
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepo;
    private final AccountRepository accountRepo;
    private final AddressRepository addressRepo;

    private final ImageService imageService;

    private final ShopMapper shopMapper;
    private final DashboardMapper dashMapper;

    @Override
    public Page<ShopDisplayDTO> getDisplayShops(Integer pageNo,
                                                Integer pageSize,
                                                String sortBy,
                                                String sortDir,
                                                String keyword,
                                                Boolean followed,
                                                Account user) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());
        Long userId = user != null ? user.getId() : null;

        //Fetch from database
        Page<IShopDisplay> shopsList = shopRepo.findShopsDisplay(keyword, followed, userId, pageable);
        Page<ShopDisplayDTO> shopDTOS = shopsList.map(shopMapper::displayToDTO);
        return shopDTOS;
    }

    @Override
    public Page<ShopDTO> getShops(Integer pageNo,
                                  Integer pageSize,
                                  String sortBy,
                                  String sortDir,
                                  String keyword,
                                  Long userId,
                                  Account user) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());
        boolean isAdmin = isAuthAdmin();

        Page<IShop> shopsList = shopRepo.findShops(keyword, userId != null ? isAdmin ? userId : null
                : isAdmin ? null : user.getId(), pageable);
        Page<ShopDTO> shopDTOS = shopsList.map(shopMapper::shopToDTO);
        return shopDTOS;
    }

    @Override
    public List<ShopPreviewDTO> getShopsPreview(Account user) {
        List<IShopPreview> shops = shopRepo.findShopsPreview(user.getId());
        List<ShopPreviewDTO> shopDTOS = shops.stream().map(shopMapper::previewToDTO).collect(Collectors.toList());
        return shopDTOS;
    }

    @Override
    public ShopInfoDTO getShopInfo(Long id, Account user) {
        Long userId = user != null ? user.getId() : null;
        IShopInfo shop = shopRepo.findShopInfoById(id, userId).orElseThrow(() ->
                new ResourceNotFoundException("Shop not found!"));
        ShopInfoDTO shopDTO = shopMapper.infoToDTO(shop); //Map to DTO
        return shopDTO;
    }

    @Override
    public ShopDetailDTO getShopDetail(Long id, Account user) {
        IShopDetail shop = shopRepo.findShopDetailById(id,
                isAuthAdmin() ? null : user.getId()).orElseThrow(() ->
                new ResourceNotFoundException("Shop not found!"));
        ShopDetailDTO shopDTO = shopMapper.detailToDTO(shop); //Map to DTO
        return shopDTO;
    }

    public StatDTO getAnalytics() {
        return dashMapper.statToDTO(shopRepo.getShopAnalytics(),
                "shops",
                "Cửa hàng");
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

        //Image upload/replace
        shop = this.changeShopPic(file, request.getImage(), shop);

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

        if (address == null) address = new Address();

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

        //Image upload/replace
        shop = this.changeShopPic(file, request.getImage(), shop);

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
    public void deleteShops(List<Long> ids, Account user) {
        List<Long> deleteIds = isAuthAdmin() ? ids : shopRepo.findShopIdsByInIdsAndOwner(ids, user.getId());
        shopRepo.deleteAllById(deleteIds);
    }

    @Transactional
    public void deleteShopsInverse(String keyword,
                                   Long userId,
                                   List<Long> ids,
                                   Account user) {
        List<Long> deleteIds = shopRepo.findInverseIds(
                keyword,
                isAuthAdmin() ? userId : user.getId(),
                ids);
        shopRepo.deleteAllById(deleteIds);
    }

    @Override
    public void deleteAllShops(Account user) {
        if (isAuthAdmin()) {
            shopRepo.deleteAll();
        } else {
            shopRepo.deleteAllByOwner(user);
        }
    }

    //Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        return (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
    }

    //Check valid role function
    protected boolean isOwnerValid(Shop shop, Account user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        boolean isAdmin = (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
        //Check if is admin or valid owner id
        return shop.getOwner().getId().equals(user.getId()) || isAdmin;
    }

    protected Shop changeShopPic(MultipartFile file, String image, Shop shop) throws IOException, ImageResizerException {
        if (file != null) { //Contain new image >> upload/replace
            if (shop.getImage() != null) imageService.deleteImage(shop.getImage().getId()); //Delete old image
            Image savedImage = imageService.upload(file); //Upload new image
            shop.setImage(savedImage); //Set new image
        } else if (image == null) { //Remove image
            if (shop.getImage() != null) imageService.deleteImage(shop.getImage().getId()); //Delete old image
            shop.setImage(null);
        }

        return shop;
    }
}
