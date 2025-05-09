package com.ring.bookstore.service;

import com.ring.bookstore.base.AbstractServiceTest;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.dto.request.PublisherRequest;
import com.ring.bookstore.model.dto.response.publishers.PublisherDTO;
import com.ring.bookstore.model.entity.Image;
import com.ring.bookstore.model.entity.Publisher;
import com.ring.bookstore.model.mappers.PublisherMapper;
import com.ring.bookstore.repository.PublisherRepository;
import com.ring.bookstore.service.impl.PublisherServiceImpl;
import com.ring.bookstore.ultils.FileUploadUtil;
import com.ring.bookstore.service.ImageService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class PublisherServiceTest extends AbstractServiceTest {

    @Mock
    private PublisherRepository pubRepo;

    @Mock
    private PublisherMapper pubMapper;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private PublisherServiceImpl pubService;

    private final MockMultipartFile file = new MockMultipartFile(
            "file",
            "book_thumbnail.png",
            MediaType.IMAGE_PNG_VALUE,
            "Book Thumbnail".getBytes());
    private final Image image = Image.builder().id(1L).name("book_image.png").build();
    private final Publisher publisher = Publisher.builder()
            .id(1)
            .name("Test Publisher")
            .build();

    private final PublisherRequest request = PublisherRequest.builder()
            .name("Test Publisher")
            .build();

    @Test
    public void whenGetPublishers_ThenReturnsPage() {

        // Given
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
        Page<Publisher> page = new PageImpl<>(List.of(publisher), pageable, 1);
        PublisherDTO mapped = new PublisherDTO(1, "Test Publisher", "image_url");
        Page<PublisherDTO> expectedDTOS = new PageImpl<>(List.of(mapped), pageable, 1);

        // When
        when(pubRepo.findPublishers(any(Pageable.class))).thenReturn(page);
        when(pubMapper.apply(any(Publisher.class))).thenReturn(mapped);

        // Then
        Page<PublisherDTO> result = pubService.getPublishers(pageable.getPageNumber(),
                pageable.getPageSize(),
                "id",
                "desc");

        assertNotNull(result);
        assertFalse(result.getContent().isEmpty());
        assertEquals(expectedDTOS.getNumber(), result.getNumber());
        assertEquals(expectedDTOS.getSize(), result.getSize());
        assertEquals(expectedDTOS.getTotalElements(), result.getTotalElements());
        assertEquals(expectedDTOS.getContent().get(0).id(), result.getContent().get(0).id());

        // Verify
        verify(pubRepo, times(1)).findPublishers(any(Pageable.class));
        verify(pubMapper, times(1)).apply(any(Publisher.class));
    }

    @Test
    public void whenGetRelevantPublishers_ThenReturnsPage() {

        // Given
        Integer cateId = 1;
        Pageable pageable = PageRequest.of(0, 10);
        Page<Publisher> page = new PageImpl<>(List.of(publisher), pageable, 1);
        PublisherDTO mapped = new PublisherDTO(1, "Test Publisher", "image_url");
        Page<PublisherDTO> expectedDTOS = new PageImpl<>(List.of(mapped), pageable, 1);

        // When
        when(pubRepo.findRelevantPublishers(eq(cateId), any(Pageable.class))).thenReturn(page);
        when(pubMapper.apply(any(Publisher.class))).thenReturn(mapped);

        // Then
        Page<PublisherDTO> result = pubService.getRelevantPublishers(pageable.getPageNumber(),
                pageable.getPageSize(),
                cateId);

        assertNotNull(result);
        assertEquals(expectedDTOS.getNumber(), result.getNumber());
        assertEquals(expectedDTOS.getSize(), result.getSize());
        assertEquals(expectedDTOS.getTotalElements(), result.getTotalElements());
        assertEquals(expectedDTOS.getContent().get(0).id(), result.getContent().get(0).id());

        // Verify
        verify(pubRepo, times(1)).findRelevantPublishers(eq(cateId), any(Pageable.class));
        verify(pubMapper, times(1)).apply(any(Publisher.class));
    }

    @Test
    public void whenGetPublisher_ThenReturnsDTO() {

        // Given
        Integer id = 1;
        PublisherDTO expected = new PublisherDTO(1, "Test Publisher", "image_url");

        // When
        when(pubRepo.findWithImageById(id)).thenReturn(Optional.of(publisher));
        when(pubMapper.apply(publisher)).thenReturn(expected);

        // Then
        PublisherDTO result = pubService.getPublisher(id);

        assertNotNull(result);
        assertEquals(expected, result);

        // Verify
        verify(pubRepo, times(1)).findWithImageById(id);
        verify(pubMapper, times(1)).apply(publisher);
    }

    @Test
    public void whenGetNonExistingPublisher_ThenThrowsException() {

        // Given
        Integer id = 1;

        // When
        when(pubRepo.findWithImageById(id)).thenReturn(Optional.empty());

        // Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> pubService.getPublisher(id));
        assertEquals("Publisher not found!", exception.getError());

        // Verify
        verify(pubRepo, times(1)).findWithImageById(id);
        verify(pubMapper, never()).apply(any(Publisher.class));
    }

    @Test
    public void whenAddPublisher_ThenReturnsNewPublisher() {

        // When
        when(imageService.upload(any(MultipartFile.class), eq(FileUploadUtil.ASSET_FOLDER))).thenReturn(image);
        when(pubRepo.save(any(Publisher.class))).thenReturn(publisher);

        // Then
        Publisher result = pubService.addPublisher(request, file);

        assertNotNull(result);
        assertEquals(publisher, result);

        // Verify
        verify(imageService, times(1)).upload(any(MultipartFile.class), eq(FileUploadUtil.ASSET_FOLDER));
        verify(pubRepo, times(1)).save(any(Publisher.class));
    }

    @Test
    public void whenUpdatePublisher_ThenReturnsUpdatedPublisher() {

        // Given
        Integer id = 1;

        // When
        when(pubRepo.findById(id)).thenReturn(Optional.of(publisher));
        when(imageService.upload(any(MultipartFile.class), eq(FileUploadUtil.ASSET_FOLDER))).thenReturn(image);
        when(pubRepo.save(any(Publisher.class))).thenReturn(publisher);

        // Then
        Publisher result = pubService.updatePublisher(id, request, file);

        assertNotNull(result);
        assertEquals(publisher, result);

        // Verify
        verify(pubRepo, times(1)).findById(id);
        verify(imageService, times(1)).upload(any(MultipartFile.class), eq(FileUploadUtil.ASSET_FOLDER));
        verify(pubRepo, times(1)).save(any(Publisher.class));
    }

    @Test
    public void whenUpdateNonExistingPublisher_ThenThrowsException() {

        // Given
        Integer id = 1;

        // When
        when(pubRepo.findById(id)).thenReturn(Optional.empty());

        // Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> pubService.updatePublisher(id, request, null));
        assertEquals("Publisher not found", exception.getError());

        // Verify
        verify(pubRepo, times(1)).findById(id);
        verify(imageService, never()).upload(any(), any());
        verify(pubRepo, never()).save(any(Publisher.class));
    }

    @Test
    public void whenDeletePublisher_ThenSuccess() {

        // Given
        Integer id = 1;

        // When
        doNothing().when(pubRepo).deleteById(id);

        // Then
        pubService.deletePublisher(id);

        // Verify
        verify(pubRepo, times(1)).deleteById(id);
    }

    @Test
    public void whenDeletePublishers_ThenSuccess() {

        // Given
        List<Integer> ids = List.of(1, 2, 3);

        // When
        doNothing().when(pubRepo).deleteAllByIdInBatch(ids);

        // Then
        pubService.deletePublishers(ids);

        // Verify
        verify(pubRepo, times(1)).deleteAllByIdInBatch(ids);
    }

    @Test
    public void whenDeletePublishersInverse_ThenSuccess() {

        // Given
        List<Integer> ids = List.of(1, 2, 3);
        List<Integer> inverseIds = List.of(4, 5);

        // When
        when(pubRepo.findInverseIds(ids)).thenReturn(inverseIds);
        doNothing().when(pubRepo).deleteAllByIdInBatch(inverseIds);

        // Then
        pubService.deletePublishersInverse(ids);

        // Verify
        verify(pubRepo, times(1)).findInverseIds(ids);
        verify(pubRepo, times(1)).deleteAllByIdInBatch(inverseIds);
    }

    @Test
    public void whenDeleteAllPublishers_ThenSuccess() {

        // When
        doNothing().when(pubRepo).deleteAll();

        // Then
        pubService.deleteAllPublishers();

        // Verify
        verify(pubRepo, times(1)).deleteAll();
    }
}